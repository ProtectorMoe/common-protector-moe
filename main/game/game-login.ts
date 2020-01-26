const {ipcRenderer} = require('electron');
import {GameConfig} from "./game-config";
import {NetSender} from "./net-sender";
import {LoginServerListBean, LoginUserInfoBean} from "../bean/net/login-bean";
import {UserData} from "./user-data";
import {UserDataBean} from "../bean/net/user-data-bean";

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
        if (tokenBean.error !== 0) {
            throw new Error("第一次登录游戏失败:" + tokenBean.error)
        }
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

    async firstLogin(): Promise<LoginServerListBean> {
        // 获取游戏版本
        ipcRenderer.send('loginText', '请求游戏版本...');
        const loginVersion = await this.netSender.getGameVersion();
        this.gameConfig.version = loginVersion.version.newVersionId;
        this.gameConfig.resVersion = loginVersion.version.DataVersion;
        this.gameConfig.loginHead = loginVersion.loginServer;
        this.gameConfig.loginApiHead = loginVersion.hmLoginServer;
        // 验证token
        ipcRenderer.send('loginText', '请求用户token...');
        const store = new Store();
        let token = this.token || await this.getToken();
        await this.checkToken(token);
        store.set({
            user: {
                username: this.username,
                password: this.password,
                serverType: this.serverType
            }
        });
        ipcRenderer.send('loginText', '发送登录数据...');
        return await this.netSender.gameLogin(token);
    }

    async secondLogin() {
        await this.netSender.indexLogin(this.gameConfig.userId);
        // 加载基础数据
        const userData = UserData.getInstance();
        const userDataBean: UserDataBean = await this.netSender.apiInitGame();
        userData.parseUserData(userDataBean);
        ipcRenderer.send('userData', userDataBean);
        // 加载点数数据
        const pveData = await this.netSender.pveGetPveData();
        userData.pveDataInit(pveData);
        ipcRenderer.send('loginSecondFinish');
    }
}
