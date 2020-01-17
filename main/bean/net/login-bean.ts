interface Version {
    newVersionId: string,
    DataVersion: string
}

export interface LoginVersionBean {
    eid: string,
    ResUrlWu: string,
    ResUrl: string,
    ResVersion: string,
    version: Version,
    loginServer: string,
    hmLoginServer: string,
    DataVersion: string
}

export interface LoginBean {
    error: number,
    access_token: string,
    token: string
}

interface ServerList {
    id: string,
    host: string,
    name: string
}

export interface LoginServerListBean {
    userId: string,
    defaultServer: string,
    serverList: Array<ServerList>
}


export interface LoginUserInfoBean {
    error: number,
    errmsg: string
}
