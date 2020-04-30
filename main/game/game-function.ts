import { NetSender } from "./net-sender";
import { UserData } from "./user-data";
import {
    PveExploreLevels,
    RubdownBean,
    SupplyBean,
    UserShipVO
} from "../bean/net/user-data-bean";
import { GetExploreBean, StartExploreBean } from "../bean/net/explore-bean";
import { Delay, SetLog, zip } from "../util/util";
import { FastRepairBean } from "main/bean/net/common-bean";

const netSender = NetSender.getInstance();
const userData = UserData.getInstance();

export class GameFunction {
    static gameFunction: GameFunction;

    static getInstance() {
        if (!this.gameFunction) this.gameFunction = new GameFunction();
        return this.gameFunction;
    }

    async checkExplore() {
        try {
            const levels: Map<string, PveExploreLevels> = userData.pveExploreVo;
            const finish = [];
            levels.forEach(value => {
                if (value.endTime && value.endTime < new Date().getTime()) {
                    finish.push({ map: value.exploreId, fleet: value.fleetId });
                }
            });
            if (finish.length > 0) {
                let startExplore: StartExploreBean;
                for (const { map, fleet } of finish) {
                    await Delay(2000);
                    // 收取远征
                    const getExploreBean: GetExploreBean = await netSender.exploreGetResult(
                        map
                    );
                    SetLog(
                        "远征",
                        `远征${map.toString().replace("000", "-")} ${
                            getExploreBean.bigSuccess === 1 ? "大" : ""
                        }成功`
                    );
                    // 更新任务
                    if (getExploreBean.updateTaskVo)
                        userData.updateTaskVo(getExploreBean.updateTaskVo);
                    // 发出远征
                    await Delay(2000);
                    startExplore = await netSender.exploreStart(fleet, map);
                }
                if (startExplore) {
                    userData.pveExploreVoInit(startExplore.pveExploreVo.levels);
                }
            }
        } catch (e) {
            console.error("远征出现错误", e);
            throw e;
        }
    }

    async checkShower() {
        try {
            let freeDock = 0;
            const waitShowerShip: Array<number> = [];
            const showingShip: Array<number> = [];
            // 空闲位置
            userData.repairDockVo.forEach(value => {
                if (value.locked == 0) {
                    if (value.shipId != null) {
                        showingShip.push(parseInt(value.shipId));
                    } else {
                        freeDock += 1;
                    }
                }
            });
            // 查找损伤船只
            userData.userShipVo.forEach((value, key) => {
                if (showingShip.indexOf(key) != -1 || value.fleet_id != 0) {
                    return;
                }
                if (value.battleProps.hp != value.battlePropsMax.hp) {
                    waitShowerShip.push(key);
                }
            });
            const minSize = Math.min(waitShowerShip.length, freeDock);
            let rubdownBean: RubdownBean;
            for (let i = 0; i < minSize; i++) {
                const shipId = waitShowerShip[i];
                await Delay(2000);
                await netSender.boatRepair(shipId);
                await Delay(2000);
                rubdownBean = await netSender.boatRubdown(shipId);
                rubdownBean.repairDockVo.forEach(value => {
                    if (
                        value.shipId != null &&
                        parseInt(value.shipId) == shipId
                    ) {
                        const date = new Date(parseInt(value.endTime));
                        SetLog(
                            "[修理]",
                            `修理 ${
                                userData.userShipVo.get(shipId).title
                            } 到 ${date.getHours()}:${date.getMinutes()}`
                        );
                    }
                });
            }
            if (rubdownBean) {
                userData.repairDockVoInit(rubdownBean.repairDockVo);
            }
        } catch (e) {
            console.log("checkShower", e);
            throw e;
        }
    }

    async checkSupply(ships: Array<number>) {
        try {
            if (
                ships
                    .map(value => userData.userShipVo.get(value))
                    .filter(value => {
                        value.battleProps.oil != value.battlePropsMax.oil &&
                            value.battleProps.ammo !=
                                value.battlePropsMax.ammo &&
                            value.battleProps.aluminium !=
                                value.battlePropsMax.aluminium;
                    }).length == 0
            ) {
                await Delay(2000);
                const supplyBean: SupplyBean = await netSender.boatSupplyBoats(
                    ships
                );
                userData.updateTaskVo(supplyBean.updateTaskVo);
                userData.userVoUpdate(supplyBean.userVo);
                userData.userShipVoInit(supplyBean.shipVO);
            }
        } catch (e) {
            console.error("checkSupply", e);
            throw e;
        }
    }

    async checkRepair(ships: Array<number>, persent: Array<number>) {
        const needRepair: Array<number> = zip(
            ships.map(v => userData.userShipVo.get(v)),
            persent
        )
            .filter(v => {
                (v.first.battleProps.hp / v.first.battlePropsMax.hp) * 100 <
                    v.second;
            })
            .map(v => v.first.id);
        if (needRepair.length != 0) {
            const fastRepairBean: FastRepairBean = await netSender.boatInstantRepairShips(
                needRepair
            );
            userData.packagesInit(fastRepairBean.packageVo);
            userData.userShipVoInit(fastRepairBean.shipVOS);
            userData.userVoUpdate(fastRepairBean.userVo);
            userData.updateTaskVo(fastRepairBean.updateTaskVo);
            SetLog(
                "[修理]",
                `修理船只:${needRepair
                    .map(v => userData.userShipVo.get(v).title)
                    .join(" ")}`
            );
        }
    }
}
