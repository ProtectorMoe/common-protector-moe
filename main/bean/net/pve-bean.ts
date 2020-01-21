export interface PveLevel {
    id: string,
    title: string,
    subTitle: string
    pveId: string
}

export interface PveNode {
    id: string,
    roundabout: string,
    flag: string,
    nextNode: Array<number>,
    nodeType: string,
    buff: Array<number>,
    gain: Map<string, number>,
    loss: Map<string, number>
}

export interface PveBuff {
    id: string,
    title: string,
    desc: string,
}

export interface PveBean {
    pveLevel: PveLevel[],
    pveNode: PveNode[],
    pveBuff: PveBuff[]
}
