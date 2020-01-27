import {FleetVo, PveExploreLevels, RepairDockVo, UserResVo, UserShipVO, UserVo} from "../net/user-data-bean";
import {PveBuff, PveLevel, PveNode} from "../net/pve-bean";

export interface LogList {
    date: string,
    time: string,
    title: string,
    dec: string,
    type: string
}

export interface TaskList {
    name: string,
    num: string,
    fleet: string,
    state: boolean
}

export interface Counter {
    challengeNum: number,
    battleNum: number,
    nodeNum: number,
    finishNum: number,
    SLNum: number,
    dpoilsNum: number
}

export interface SelfInfo {
    version: string,
    gameVersion: string
}

export interface State {
    // 需要存的后端数据
    userResVo: UserResVo,
    userVo: UserVo,
    fleetVo: Map<string, FleetVo>,
    userShipVo: Map<number, UserShipVO>,
    pveExploreVo: Map<string, PveExploreLevels>,
    repairDockVo: Array<RepairDockVo>,
    packages: Map<number, number>,
    pve: {
        pveNode: object,
        pveLevel: object,
        pveBuff: object,
    }

    // 特定前端数据
    isFirstLogin: boolean;
    selfInfo: SelfInfo,
    counter: Counter,
    taskList: Array<TaskList>,
    logList: Array<LogList>
}
