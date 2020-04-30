import {ChallengeData, ChallengePathDetail} from "main/bean/game/task-bean";
import {FleetVo} from "main/bean/net/user-data-bean";
import {PveNode} from "main/bean/net/pve-bean";
import {UserData} from "../user-data";
import {GameFunction} from "../game-function";
import {NetSender} from "../net-sender";
import {Delay, ObjectToMap, SetDetailLog} from "main/util/util";
import {NewNextBean, SpyBean, SkipWarBean} from "main/bean/net/challenge";

const netSender = NetSender.getInstance();
const userData: UserData = UserData.getInstance();
const gameFunction: GameFunction = GameFunction.getInstance();

export enum Result {
    FINISH,
    SL,
    REPAIR,
    BROKEN,
    DISMANTLE,
    ERROR
}

class ChallengeSL extends Error {
}

export class Challenge {
    private challengeData: ChallengeData;
    private detailsMap: Map<string, ChallengePathDetail>;
    private head = "pve";

    constructor(challengeData: ChallengeData) {
        this.challengeData = challengeData;
        this.detailsMap = ObjectToMap(challengeData.path.detail);
    }

    async execute() {
        let skipFailCount = 0;
        try {
            // 数据初始化
            SetDetailLog("出征", "准备开始出征");
            const fleetVo: FleetVo = userData.fleetVo.get(this.challengeData.fleet); // 当前舰队详细数据
            const mapName = userData.pveLevel.get(this.challengeData.path.map).title;
            // 战前准备
            // TODO 检测船只是否匹配, 并进行更换船只
            SetDetailLog("出征", "补给船只");
            await gameFunction.checkSupply(fleetVo.ships); // 船只进行补给
            SetDetailLog("出征", "修理船只");
            await gameFunction.checkRepair(fleetVo.ships, this.challengeData.repair); // 修理船只
            // TODO 分解船只和检测船舱
            // 开始出征
            SetDetailLog("出征", "开始出征");
            await Delay(2000);
            // ----------------出征页面---------------------
            await netSender.battleChallenge(this.head, this.challengeData.path.map, this.challengeData.fleet);
            while (true) {
                // ----------------选路页面-------------
                await Delay(2000);
                const nextNode: NewNextBean = await netSender.battleNewNext(this.head);
                const pveNode = userData.pveNode.get(nextNode.node);
                const nowFlag = pveNode.flag;
                // 是否为期望点
                SetDetailLog("出征", `进点${nowFlag} → ${this.detailsMap.has(nowFlag) ? "继续" : "SL"}`);
                if (this.detailsMap.hasOwnProperty(nowFlag)) {
                    SetDetailLog("出征", "进错点, SL");
                    await Delay(1000);
                    throw new ChallengeSL("不为期望点, SL");
                }
                // 读取点基本数据
                const lastPoint = pveNode.nextNode.map(
                    v => userData.pveNode.get(v.toString()))
                    .filter(v => this.challengeData.path.detail.hasOwnProperty(v.flag || "-")).length == 0;
                const nodeType = parseInt(pveNode.nodeType);
                const nodeDetail = this.detailsMap.get(nowFlag);
                const nodeDetailEnemy = nodeDetail.detail;
                let nowFormat = 0;
                // 进入战斗流程
                // 选择战况
                if (pveNode.buff.length != 0) {
                    SetDetailLog('出征', `选择战况: ${userData.pveBuff.get(nodeDetail.buff).title}`);
                    await Delay(1000);
                    await netSender.selectBuff(nodeDetail.buff);
                }
                // 1:普通点, 2:BOSS点, 3:资源点 4:待机点, 5:收费站, 10:航空站
                if ([1, 2, 10, 11].indexOf(nodeType) != -1) {
                    await Delay(2000);
                    // --------------开始索敌-------------
                    const spyBean: SpyBean = await netSender.battleSpy(this.head);
                    // 取得敌人数量
                    const enemyNumMap: Map<number, number> = new Map();
                    spyBean.enemyVO.enemyShips.forEach(v => {
                        if (!enemyNumMap.has(v.type)) {
                            enemyNumMap.set(v.type, 1);
                        } else {
                            enemyNumMap.set(v.type, enemyNumMap.get(v.type) + 1);
                        }
                    });
                    // 判断是否需要SL
                    nodeDetailEnemy.forEach(v => {
                        const enemy = parseInt(v.enemy);
                        const enemyNum = parseInt(v.num);
                        const enemyDeal = parseInt(v.deal);
                        const nowEnemyNum = enemyNumMap.has(enemy) ? enemyNumMap.get(enemy) : 0;
                        if ((enemyNum < 6 && nowEnemyNum >= enemyNum) || (enemyNum > 6 && nowEnemyNum < enemyNum - 6)) {
                            if (enemyDeal == 0) {
                                throw new ChallengeSL("舰船SL启动");
                            }
                            nowFormat = enemyDeal;
                        }
                    });
                    // 判断是否需要迂回
                    if (nodeDetail.round_about && parseInt(pveNode.roundabout) == 1) {
                        SetDetailLog('出征', `尝试进行迂回`);
                        await Delay(1000);
                        const skipWarBean: SkipWarBean = await netSender.battleSkipWar(this.head);
                        if (skipWarBean.isSuccess == 0) {  // 迂回失败
                            skipFailCount += 1;
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
}
