const config = require("../util/config.ts");

class Login {
    private static ins: Login;
    private constructor() {};
    public static getInstance():Login {
        if (!Login.ins) {Login.ins = new Login()}
        return Login.ins;
    }

    username: string;
    pwd: string;
    serverType: string;

    initialize(username: string, pwd: string, serverType: string): void {
        this.username = username;
        this.pwd = pwd;
        this.serverType = serverType;
        switch (serverType) {
            case '0':  // Android服务器
                config.authHeader = 'HMS 881d3SlFucX5R5hE';
                config.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                config.channel = '100016';
                config.resUrl = 'http://login.jr.moefantasy.com/index/getInitConfigs/';
                config.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100016/2&version=4.1.0&channel=100016&market=2';
                break;
            case '1': // IOS服务器
                config.authHeader = 'HMS 881d3SlFucX5R5hE';
                config.authKey = 'kHPmWZ4zQBYP24ubmJ5wA4oz0d8EgIFe';
                config.channel = '100015';
                config.resUrl = 'http://loginios.jr.moefantasy.com/index/getInitConfigs/';
                config.urlVersion = 'http://version.jr.moefantasy.com/index/checkVer/4.1.0/100015/2&version=4.1.0&channel=100015&market=2';
                break;
        }
    }

    firstLogin(): void {
        // 获取游戏版本


    }
}

module.exports = Login.getInstance();
