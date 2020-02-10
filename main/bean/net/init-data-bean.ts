export interface InitDataBean {
    shipCardWu: Array<ShipCardWu>,
    shipCard: Array<ShipCardWu>
}

export interface ShipCardWu {
    cid: number,
    star: number,
    title: string,
    country: string,
    type: string,
    shipIndex: string,
    equipmentType: Array<number>
}
