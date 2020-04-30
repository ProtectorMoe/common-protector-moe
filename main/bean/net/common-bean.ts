import { PackageVo, UserVo, ShipVO, UpdateTaskVo } from "./user-data-bean";

export interface FastRepairBean {
    packageVo: Array<PackageVo>,
    userVo: UserVo,
    shipVOS: Array<ShipVO>,
    updateTaskVo: Array<UpdateTaskVo>
}