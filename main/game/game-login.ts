import {GameConfig} from "./game-config";
import {NetSender} from "./net-sender";
import {LoginServerListBean, LoginUserInfoBean} from "../bean/net/login-bean";

const Store = require('electron-store');

export class GameLogin {
    static ins: GameLogin;
    netSender: NetSender = NetSender.getInstance();

    static getInstance(): GameLogin {
        if (!GameLogin.ins) {
            GameLogin.ins = new GameLogin()
        }
        return GameLogin.ins;
    }

    username: string;
    password: string;
    serverType: string;
    token: string;
    gameConfig: GameConfig = GameConfig.getInstance();

    initialize(username: string, password: string, serverType: string): void {
        this.username = username;
        this.password = password;
        this.serverType = serverType;
        switch (serverType) {
            case '0':  // Android服务器
                this.gameConfig.authHeader = 'HMS 881d3SlFucX5R5hE';
                this.gameConfig.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                this.gameConfig.channel = '100016';
                this.gameConfig.resUrl = 'http://login.jr.moefantasy.com/index/getInitConfigs/';
                this.gameConfig.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100016/2&version=4.1.0&channel=100016&market=2';
                break;
            case '1': // IOS服务器
                this.gameConfig.authHeader = 'HMS 881d3SlFucX5R5hE';
                this.gameConfig.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                this.gameConfig.channel = '100015';
                this.gameConfig.resUrl = 'http://loginios.jr.moefantasy.com/index/getInitConfigs/';
                this.gameConfig.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100015/2&version=4.1.0&channel=100015&market=2';
                break;
        }
    }

    async checkToken(token: string) {
        const tokenBean: LoginUserInfoBean = await this.netSender.loginUserInfo(token);
        return tokenBean.error == 0;
    }

    async firstLogin(): Promise<LoginServerListBean> {
        // 获取游戏版本
        const loginVersion = await this.netSender.getGameVersion();
        this.gameConfig.version = loginVersion.version.newVersionId;
        this.gameConfig.resVersion = loginVersion.version.DataVersion;
        this.gameConfig.loginHead = loginVersion.loginServer;
        this.gameConfig.loginApiHead = loginVersion.hmLoginServer;
        // 验证token
        const store = new Store();
        let token = store.get(`${this.username}.token`) || "";
        while (true) {
            if (!token || token.length < 10) {
                token = await this.getToken()
            }
            if (await this.checkToken(token)) {
                store.set({
                    default: this.username,
                    [this.username]: {
                        password: this.password,
                        token: this.token
                    }
                });
                break;
            } else {
                token = null;
            }
        }
        // 尝试登录游戏
        return await this.netSender.gameLogin(token);
    }


    async getToken() {
        const data = {
            platform: '0',
            appid: '0',
            app_server_type: '0',
            password: this.password,
            username: this.username
        };
        const loginBean = await this.netSender.loginLogin(data);
        if (loginBean.error !== 0) throw new Error(`登录失败, 错误代码${loginBean.error}`);
        return loginBean.access_token || loginBean.token;
    }
}
