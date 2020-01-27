import {PackageVo, PveExploreVo, UpdateTaskVo, UserResVo} from "./user-data-bean";

export interface GetExploreBean {
    bigSuccess: number,
    userResVo: UserResVo,
    packageVos: Array<PackageVo>,
    updateTaskVo: Array<UpdateTaskVo>
}

export interface StartExploreBean {
    pveExploreVo: PveExploreVo,
    exploreId: string
}
