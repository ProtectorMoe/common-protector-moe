export class GameConfig {
    private static ins: GameConfig;
    private constructor() {}
    public static getInstance(): GameConfig {
        if (!GameConfig.ins) {
            GameConfig.ins = new GameConfig();
        }
        return GameConfig.ins;
    }
    // 第一次登录获取地址
    authHeader: string = "";
    authKey: string = "";
    resUrl: string = "";
    channel: string = "";
    version: string = "";
    urlVersion: string = "";

    // 第二次登录获取地址
    host: string = "";
    userId: string = "";
    loginHead: string = "";
    loginApiHead: string = "";
}
