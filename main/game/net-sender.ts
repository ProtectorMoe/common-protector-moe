import { GameConfig } from "./game-config";
import { YesHttp, CookieJar, Interceptor } from "../util/yes-http";
import { HmException } from "./hm-exception";
import {
    LoginVersionBean,
    LoginBean,
    LoginUserInfoBean,
    LoginServerListBean
} from "../bean/net/login-bean";
import { encryptionHMAC, stringToMd5 } from "../util/encryption";
import { GetSeedRandom } from "../util/util";
import { UserDataBean } from "../bean/net/user-data-bean";
import { PveBean } from "../bean/net/pve-bean";
import { InitDataBean } from "../bean/net/init-data-bean";

const gameConfig = GameConfig.getInstance();

export class NetSender {
    static ins: NetSender;
    private yesHttp: YesHttp;

    static cookieStore: Array<string> = [];

    static getInstance(): NetSender {
        if (!NetSender.ins) {
            NetSender.ins = new NetSender();
        }
        return NetSender.ins;
    }

    private constructor() {
        this.yesHttp = new YesHttp()
            .setCookieJar(
                new (class implements CookieJar {
                    saveFromResponse: (
                        url: string,
                        cookies: Array<string>
                    ) => void = (url, cookies) => {
                        if (url.indexOf("hmLogin") > 0) {
                            NetSender.cookieStore = cookies;
                        }
                    };
                    loadForRequest: (url: string) => Array<string> = url => {
                        if (
                            url.indexOf("passport") > 0 ||
                            url.indexOf("hmLogin") > 0
                        ) {
                            return [];
                        }
                        return NetSender.cookieStore;
                    };
                })()
            )
            .setInterceptor(
                new (class implements Interceptor {
                    onRequest: (url: string, options) => any = (
                        url,
                        options
                    ) => {
                        if (url.indexOf("passport") > -1) {
                            const date = new Date();
                            options.headers["Authorization"] =
                                GameConfig.getInstance().authHeader +
                                ":" +
                                encryptionHMAC(url, date);
                            options.headers["Date"] = date.toUTCString();
                            options.headers["Content-Type"] =
                                "application/json";
                            options.headers["User-Agent"] = "okhttp/3.12.1";
                            options.headers["Accept-Encoding"] = "gzip";
                        } else {
                            options.headers["User-Agent"] =
                                "Dalvik/2.1.0 (Linux; U; Android 5.0.1; oppo a53 Build/LMY48Z)";
                            options.headers["Accept-Encoding"] = "identity";
                        }
                    };
                })()
            );
    }

    urlBuilder(path: string, extra?: any, head?: string): string {
        const key = "ade2688f1904e9fb8d2efdb61b5e398a";
        const t = new Date().getTime();
        const e = stringToMd5(t + key);
        const end = {
            ...extra,
            t,
            e,
            gz: 1,
            market: 2,
            channel: gameConfig.channel,
            version: gameConfig.version
        };
        const keys = Object.keys(end).map(key => `${key}=${end[key]}`);
        return (head || gameConfig.host) + path + `&${keys.join("&")}`;
    }

    async getGameVersion(): Promise<LoginVersionBean> {
        const data = await this.yesHttp.connect({
            url: GameConfig.getInstance().urlVersion
        });
        return HmException.parse("getGameVersion", data.buffer.toString());
    }

    async getInitData(): Promise<string> {
        const data = await this.yesHttp.connect({
            url: this.urlBuilder("", null, gameConfig.resUrl),
            zlib: true
        });
        return data.buffer.toString();
    }

    /**
     * 由用户名密码判断是否是正确的
     * 如果是错的会返回errmsg,error不是0
     * @param data
     */
    async loginLogin(data: any): Promise<LoginBean> {
        const request = await this.yesHttp.connect({
            url: gameConfig.loginApiHead + "1.0/get/login/@self",
            method: "POST",
            body: data,
            zlib: true
        });
        return HmException.parse("loginLogin", request.buffer.toString());
    }

    /**
     * 验证token是否过期
     * @param token
     */
    async loginUserInfo(token: string): Promise<LoginUserInfoBean> {
        const request = await this.yesHttp.connect({
            url: gameConfig.loginApiHead + "1.0/get/userInfo/@self",
            method: "POST",
            body: { access_token: token },
            zlib: true
        });
        return HmException.parse("loginLogin", request.buffer.toString());
    }

    /**
     * 第一次登录由token获取serverList
     * @param token
     */
    async gameLogin(token: string): Promise<LoginServerListBean> {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(
                `index/hmLogin/${token}`,
                null,
                gameConfig.loginHead
            ),
            zlib: true
        });
        return HmException.parse("loginLogin", request.buffer.toString());
    }

    /**
     * 第一次登录向服务器发送设备信息
     * @param userId
     */
    async indexLogin(userId: string) {
        const params = {
            client_version: gameConfig.version,
            phone_type: "oppo%20a53",
            phone_version: "5.1.1",
            ratio: "1920*1080",
            service: "CHINA%20MOBILE",
            udid: GetSeedRandom(
                parseInt(gameConfig.userId),
                10000000000000000,
                999999999999999
            ),
            source: "android",
            affiliate: "WIFI"
        };
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`index/login/${userId}?`, params),
            zlib: true
        });
        return HmException.parse("indexLogin", request.buffer.toString());
    }

    /**
     * 游戏启动时候初始化数据
     */
    async apiInitGame(): Promise<UserDataBean> {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder("api/initGame?&crazy=0"),
            zlib: true
        });
        return HmException.parse("apiInitGame", request.buffer.toString());
    }

    /**
     * 获取pve的点数信息
     */
    async pveGetPveData(): Promise<PveBean> {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder("pve/getPveData/"),
            zlib: true
        });
        return HmException.parse("pveGetPveData", request.buffer.toString());
    }

    /**
     * 获取活动的点数信息
     */
    async peventGetPveData() {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder("pevent/getPveData/"),
            zlib: true
        });
        return HmException.parse("peventGetPveData", request.buffer.toString());
    }

    /**
     * 远征获取结果
     * @param map
     */
    async exploreGetResult(map: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`explore/getResult/${map}/`),
            zlib: true
        });
        return HmException.parse(
            "explore/getResult/",
            request.buffer.toString()
        );
    }

    /**
     * 远征派出舰队
     * @param fleet
     * @param map
     */
    async exploreStart(fleet: string, map: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`explore/start/${fleet}/${map}/`),
            zlib: true
        });
        return HmException.parse("explore/start", request.buffer.toString());
    }

    async boatSupplyBoats(ships: Array<number>) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`boat/supplyBoats/[${ships.join(",")}]/0/0/`),
            zlib: true
        });
        return HmException.parse("boat/supplyBoats", request.buffer.toString());
    }

    async boatLock(ship: number) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`boat/lock/${ship}/`),
            zlib: true
        });
        return HmException.parse("boat/lock", request.buffer.toString());
    }

    async dismantleBoat(ships: Array<number>, isUnload: boolean) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(
                `dock/dismantleBoat/[${ships.join(",")}]/${
                    isUnload ? "0" : "1"
                }/`
            ),
            zlib: true
        });
        return HmException.parse(
            "dock/dismantleBoat",
            request.buffer.toString()
        );
    }

    async repairComplete(dock: number, ship: number) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`boat/repairComplete/${dock}/${ship}/`),
            zlib: true
        });
        return HmException.parse(
            "boat/repairComplete",
            request.buffer.toString()
        );
    }

    async boatRepair(ship: number) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`boat/repair/${ship}/0/`),
            zlib: true
        });
        return HmException.parse("boat/repair", request.buffer.toString());
    }

    async boatRubdown(ship: number) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`boat/rubdown/${ship}`),
            zlib: true
        });
        return HmException.parse("boat/rubdown", request.buffer.toString());
    }

    async boatInstantRepairShips(ships: Array<number>) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(
                `boat/instantRepairShips/[${ships.join(",")}]/`
            ),
            zlib: true
        });
        return HmException.parse(
            "boat/instantRepairShips",
            request.buffer.toString()
        );
    }

    async battleChallenge(head: string, map: string, fleet: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/cha11enge/${map}/${fleet}/0/`),
            zlib: true
        });
        return HmException.parse("challenge", request.buffer.toString());
    }

    async battleNewNext(head: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/newNext/`),
            zlib: true
        });
        return HmException.parse("newNext", request.buffer.toString());
    }

    async selectBuff(buff: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`pve/selectBuff/${buff}`),
            zlib: true
        });
        return HmException.parse("pve/selectBuff", request.buffer.toString());
    }

    async battleSpy(head: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/spy/`),
            zlib: true
        });
        return HmException.parse("spy", request.buffer.toString());
    }

    async battleDealto(
        head: string,
        node: string,
        fleet: string,
        format: string
    ) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/dealto/${node}/${fleet}/${format}/`),
            zlib: true
        });
        return HmException.parse("dealto", request.buffer.toString());
    }

    async battleGetWarResult(head: string, nightFight: boolean) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/getWarResult/${nightFight ? 1 : 0}/`),
            zlib: true
        });
        return HmException.parse("getWarResult", request.buffer.toString());
    }

    async battleSkipWar(head: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/SkipWar/`),
            zlib: true
        });
        return HmException.parse("SkipWar", request.buffer.toString());
    }

    async setFleet(fleet: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`pevent/setFleet/${fleet}/`),
            zlib: true
        });
        return HmException.parse("pevent/setFleet", request.buffer.toString());
    }

    async getChallengeList() {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`pvp/getChallengeList/`),
            zlib: true
        });
        return HmException.parse(
            "pvp/getChallengeList/",
            request.buffer.toString()
        );
    }

    async friendGetlist() {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`friend/getlist/`),
            zlib: true
        });
        return HmException.parse("friend/getlist/", request.buffer.toString());
    }

    async friendVisitorFriend(uid: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`friend/visitorFriend/${uid}/`),
            zlib: true
        });
        return HmException.parse(
            "friend/visitorFriend/",
            request.buffer.toString()
        );
    }

    async pvpSpy(head: string, uid: string, fleet: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`${head}/spy/${uid}/${fleet}/`),
            zlib: true
        });
        return HmException.parse("spy", request.buffer.toString());
    }

    async pvpChallenge(
        head: string,
        uid: string,
        fleet: string,
        format: number
    ) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(
                `${head}/challenge/${uid}/${fleet}/${format}/`
            ),
            zlib: true
        });
        return HmException.parse("challenge", request.buffer.toString());
    }

    async campaignGetFleet(map: string) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`campaign/getFleet/${map}/`),
            zlib: true
        });
        return HmException.parse(
            "campaign/getFleet",
            request.buffer.toString()
        );
    }

    async campaignChallenge(map: string, format: number) {
        const request = await this.yesHttp.connect({
            url: this.urlBuilder(`campaign/challenge/${map}/${format}/`),
            zlib: true
        });
        return HmException.parse(
            "campaign/challenge",
            request.buffer.toString()
        );
    }
}
