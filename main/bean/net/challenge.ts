import { ShipVO } from "./user-data-bean";

export interface NewNextBean {
    node: string
}

export interface EnemyFleet {
    id: number,
    title: string,
}

export interface EnemyVO {
    isFound: number,
    enemyShips: Array<ShipVO>
}

export interface SpyBean {
    enemyVO: EnemyVO
}

export interface SkipWarBean {
    isSuccess: number
}