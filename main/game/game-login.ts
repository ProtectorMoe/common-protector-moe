import {GameConfig} from "../util/config";

import {NetSender} from "./net-sender";

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
    pwd: string;
    serverType: string;
    config: GameConfig = GameConfig.getInstance();

    initialize(username: string, pwd: string, serverType: string): void {
        this.username = username;
        this.pwd = pwd;
        this.serverType = serverType;
        switch (serverType) {
            case '0':  // Android服务器
                this.config.authHeader = 'HMS 881d3SlFucX5R5hE';
                this.config.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                this.config.channel = '100016';
                this.config.resUrl = 'http://login.jr.moefantasy.com/index/getInitConfigs/';
                this.config.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100016/2&version=4.1.0&channel=100016&market=2';
                break;
            case '1': // IOS服务器
                this.config.authHeader = 'HMS 881d3SlFucX5R5hE';
                this.config.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                this.config.channel = '100015';
                this.config.resUrl = 'http://loginios.jr.moefantasy.com/index/getInitConfigs/';
                this.config.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100015/2&version=4.1.0&channel=100015&market=2';
                break;
        }
    }

    async firstLogin() {
        // 获取游戏版本
        console.log(await this.netSender.getGameVersion())
    }
}
