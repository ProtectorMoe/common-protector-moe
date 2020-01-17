import {GameConfig} from "./game-config";
import {YesHttp, CookieJar, Interceptor} from "../util/yes-http";
import {HmException} from "./hm-exception";
import {LoginVersionBean, LoginBean} from "../bean/net/login-bean";
import {encryptionHMAC, stringToMd5} from "../util/encryption";

export class NetSender {
    static ins: NetSender;
    private yesHttp: YesHttp;

    static cookieStore: Array<string> = [];

    static getInstance():NetSender {
        if (!NetSender.ins) {NetSender.ins = new NetSender()}
        return NetSender.ins;
    }

    private constructor() {
        this.yesHttp = new YesHttp()
            .setCookieJar(new class implements CookieJar {
                saveFromResponse: (url: string, cookies: Array<string>) => void = (url, cookies) => {
                    if (url.indexOf("login") > 0) {
                        NetSender.cookieStore = cookies;
                    }
                };
                loadForRequest: (url: string) => Array<string> = (url => {
                    if (url.indexOf("passport") > 0 || url.indexOf('login') > 0) {
                        return [];
                    }
                    return NetSender.cookieStore
                });
            }).setInterceptor(new class implements Interceptor {
                onRequest: (url: string, options) => any = (url, options) => {
                    if (url.indexOf("passport") > -1) {
                        const date = new Date();
                        options.headers['Authorization'] = GameConfig.getInstance().authHeader + ":" + encryptionHMAC(url, date);
                        options.headers['Date'] = date.toUTCString();
                        options.headers['Content-Type'] = 'application/json';
                        options.headers['User-Agent'] = 'okhttp/3.12.1';
                        options.headers['Accept-Encoding'] = 'gzip';
                    } else {
                        options.headers['User-Agent'] = 'Dalvik/2.1.0 (Linux; U; Android 5.0.1; oppo a53 Build/LMY48Z)';
                        options.headers['Accept-Encoding'] = 'identity'
                    }
                }
            });
    };

    getTimeToken() {
        const key = "ade2688f1904e9fb8d2efdb61b5e398a";
        const t = new Date().getTime();
        const e = stringToMd5(t + key);
        return {
            t,
            e,
            gz: 1,
            market: 2,
            channel: GameConfig.getInstance().channel,
            version: GameConfig.getInstance().version
        }
    }


    async getGameVersion(): Promise<LoginVersionBean> {
        const data = await this.yesHttp.connect({
            url: GameConfig.getInstance().urlVersion
        });
        return HmException.parse('getGameVersion', data.buffer.toString());
    }

    async loginLogin(data: any): Promise<LoginBean> {
        const request = await this.yesHttp.connect({
            url: GameConfig.getInstance().loginApiHead + "1.0/get/login/@self",
            method: "POST",
            body: data,
            zlib: true
        });
        return HmException.parse('loginLogin', request.buffer.toString());
    }

    async loginUserInfo(token: string) {
        const request = await this.yesHttp.connect({
            url: GameConfig.getInstance().loginApiHead + "1.0/get/userInfo/@self",
            method: "POST",
            body: {'access_token': token},
            zlib: true
        });
        return HmException.parse('loginLogin', request.buffer.toString());
    }

    async gameLogin(token: string) {
        const request = await this.yesHttp.connect({
            url: GameConfig.getInstance().loginHead + "index/hmLogin/" + token,
            params: this.getTimeToken(),
            zlib: true
        });
        return HmException.parse('loginLogin', request.buffer.toString());
    }
}
