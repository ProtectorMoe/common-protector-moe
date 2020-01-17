export class UserData {
    static instance: UserData;
    static getInstance(): UserData {
        if (!UserData.instance) UserData.instance = new UserData();
        return UserData.instance;
    }
}




