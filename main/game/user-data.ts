interface UserVo {
    ammo: number,
    oil: number,
    aluminium: number,
    steel: number
}

interface UserInfo {
    uid: string,
    username: string,
    level: number,
    shipNumTop: number,
    equipmentNumTop: number,
}


export class UserData {
    static instance: UserData;

    static getInstance(): UserData {
        if (!UserData.instance) UserData.instance = new UserData();
        return UserData.instance;
    }

    userInfo: UserInfo = {
        uid: "",
        username: "",
        level: 0,
        shipNumTop: 0,
        equipmentNumTop: 0,
    };

    userVo: UserVo = {
        ammo: 0,
        oil: 0,
        aluminium: 0,
        steel: 0
    }

}




