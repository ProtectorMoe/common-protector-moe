import {NetSender} from "./net-sender";
import {UserData} from "./user-data";
import {PveExploreLevels} from "../bean/net/user-data-bean";
import {GetExploreBean, StartExploreBean} from "../bean/net/explore-bean";
import {Delay, SetLog} from "../util/util";

const netSender = NetSender.getInstance();
const userData = UserData.getInstance();

export class GameFunction {
    static gameFunction: GameFunction;
    static getInstance() {
        if (!this.gameFunction)
            this.gameFunction = new GameFunction();
        return this.gameFunction;
    }

    async checkExplore() {
        try {
            const levels: Map<string, PveExploreLevels> = userData.pveExploreVo;
            const finish = [];
            levels.forEach(value => {
                if (value.endTime && value.endTime < new Date().getTime()) {
                    finish.push({
                        map: value.exploreId,
                        fleet: value.fleetId
                    });
                }
            });
            if (finish.length > 0) {
                let startExplore: StartExploreBean;
                for (const {map, fleet} of finish) {
                    await Delay(2000);
                    // 收取远征
                    const getExploreBean: GetExploreBean = await netSender.exploreGetResult(map);
                    SetLog(`[远征] 远征${map.toString().replace('000', '-')} ${getExploreBean.bigSuccess === 1? "大":""}成功`);
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
            console.error('远征出现错误', e);
            throw e
        }
    }
}
