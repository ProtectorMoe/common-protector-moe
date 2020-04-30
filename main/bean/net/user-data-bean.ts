export interface BattleProps {
    hp: number,
    oil: number,
    ammo: number,
    aluminium: number
}


export interface UserShipVO {
    id: number,
    title: string,
    level: number,
    exp: number,
    fleet_id: number,
    love: number,
    isLocked: number,
    shipCid: number,
    type: number,
    battleProps: BattleProps,
    battlePropsMax: BattleProps
}

export interface ShipVO extends UserShipVO{

}

export interface EquipmentVo {
    equipmentCid: number,
    num: number,
    locked: number
}


export interface DockVo {
    id: number,
    locked: number,
    shipId: string,
    endTime: string
}

export interface RepairDockVo extends DockVo {
}

export interface FleetVo {
    id: string,
    title: string,
    ships: Array<number>
}

export interface PackageVo {
    itemCid: number,
    num: number
}

export interface UserResVo {
    oil: number,
    ammo: number,
    steel: number,
    aluminium: number
}

export interface UserVo extends UserResVo {
    uid: string,
    username: string,
    level: number,
    shipNumTop: number,
    equipmentNumTop: number
}

export interface Condition {
    totalAmount: number,
    finishedAmount: number
}

export interface TaskVo {
    taskCid: string,
    title: string,
    award: Map<string, number>,
    condition: Array<Condition>
}

export interface UpdateTaskVo extends TaskVo{
}


export interface FriendVo {
    sign: string,
    avatar_cid: string,
    username: string
}

export interface ContinueLoginAward {
    canGetDay: number
}

export interface MarketingData {
    continueLoginAward: ContinueLoginAward
}


export interface PveExploreLevels {
    exploreId: string,
    fleetId: string,
    endTime: number
}

export interface PveExploreVo {
    levels: PveExploreLevels[]
}


export interface UserDataBean {
    userVo: UserVo,
    userShipVO: Array<UserShipVO>,
    equipmentVo: Array<EquipmentVo>,
    dockVo: Array<DockVo>,
    repairDockVo: Array<RepairDockVo>,
    fleetVo: Array<FleetVo>,
    packageVo: Array<PackageVo>,
    unlockShip: Array<string>,
    unlockEquipment: Array<string>,
    taskVo: Array<TaskVo>,
    pveExploreVo: PveExploreVo,
    friendVo: FriendVo,
    marketingData: MarketingData
}

export interface UpdateTaskVo {
    taskCid: string,
    condition: Array<Condition>
}

export interface RubdownBean {
    repairDockVo: Array<RepairDockVo>
}

export interface SupplyBean {
    userVo: UserVo,
    shipVO: Array<ShipVO>,
    updateTaskVo: Array<UpdateTaskVo>
}
