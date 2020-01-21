import {PveBean, PveBuff, PveLevel, PveNode} from "../bean/net/pve-bean";
import {
    FleetVo,
    PackageVo,
    PveExploreLevels,
    RepairDockVo, ShipVO,
    TaskVo,
    UpdateTaskVo, UserDataBean, UserResVo,
    UserShipVO, UserVo
} from "../bean/net/user-data-bean";

export class UserData {
    static instance: UserData;
    static getInstance(): UserData {
        if (!UserData.instance) UserData.instance = new UserData();
        return UserData.instance;
    }

    // 基础数据
    userBase: UserVo;

    parseUserData(userData: UserDataBean) {
        this.userBase = userData.userVo;
        this.fleetVoInit(userData.fleetVo);
        this.userShipVoInit(userData.userShipVO);
        this.pveExploreVoInit(userData.pveExploreVo.levels);
        this.packagesInit(userData.packageVo);
        this.repairDockVoInit(userData.repairDockVo);
        this.unlockedShipInit(userData.unlockShip);
        this.taskVoInit(userData.taskVo);
    }

    // ----------------- 点数数据 -----------------
    pveNode: Map<string, PveNode> = new Map<string, PveNode>();
    pveLevel: Map<string, PveLevel> = new Map<string, PveLevel>();
    pveBuff: Map<string, PveBuff> = new Map<string, PveBuff>();
    pveDataInit(pveData: PveBean): void {
        pveData.pveNode.forEach(value => this.pveNode.set(value.id, value));
        pveData.pveLevel.forEach(value => this.pveLevel.set(value.id, value));
        pveData.pveBuff.forEach(value => this.pveBuff.set(value.id, value));
    }

    // -------------------用户舰队------------------
    fleetVo: Map<string, FleetVo> = new Map<string, FleetVo>();
    fleetVoInit(fleetVos: Array<FleetVo>) {
        this.fleetVo.clear();
        fleetVos.forEach(value => this.fleetVo.set(value.id, value))
    }
    // -------------------用户船只------------------
    userShipVo: Map<number, UserShipVO> = new Map<number, UserShipVO>();
    userShipVoInit(ships: Array<ShipVO | UserShipVO>) {
        ships.forEach(value => this.userShipVo.set(value.id, value));
    }
    userShipAdd(ship: UserShipVO | ShipVO) {
        this.userShipVo.set(ship.id, ship);
    }
    userShipDel(ships: Array<UserShipVO | ShipVO>) {
        ships.forEach(value => this.userShipVo.delete(value.id))
    }

    // ----------------------远征数据-----------------
    pveExploreVo: Map<string, PveExploreLevels> = new Map<string, PveExploreLevels>();
    pveExploreVoInit(explores: Array<PveExploreLevels>) {
        this.pveExploreVo.clear();
        explores.forEach(value => this.pveExploreVo.set(value.exploreId, value))
    }
    // ---------------------已经拥有船只信息-------------------
    unlockedShip: Array<string> = new Array<string>();
    unlockedShipInit(ships: Array<string>) {
        this.unlockedShip = ships;
    }
    unlockedShipAdd(ship: string) {this.unlockedShip.push(ship)}
    // -----------------------澡堂数据-------------------------
    repairDockVo: Array<RepairDockVo> = new Array<RepairDockVo>();
    repairDockVoInit(docks: Array<RepairDockVo>) {
        this.repairDockVo = docks;
    }
    // ---------------------package的数据----------------------
    packages: Map<number, number> = new Map<number, number>();
    packagesInit(packagesVo: Array<PackageVo>) {
        packagesVo.forEach(value => this.packages.set(value.itemCid, value.num))
    }
    // ------------------------ 任务数据 --------------------------
    taskVo: Map<string, TaskVo> = new Map<string, TaskVo>();
    taskVoInit(taskVos: Array<TaskVo>) {
        taskVos.forEach(value => this.taskVo.set(value.taskCid, value))
    }
    updateTaskVo(updateTaskVo: Array<UpdateTaskVo>) {
        updateTaskVo.forEach(value => {
            const task: TaskVo = this.taskVo.get(value.taskCid);
            task.condition = value.condition;
        })
    }



}




