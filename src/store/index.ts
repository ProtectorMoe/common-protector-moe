import Vue from 'vue'
import Vuex from 'vuex'
import {
    FleetVo,
    PveExploreLevels, RepairDockVo,
    UserResVo,
    UserShipVO,
    UserVo
} from "../../main/bean/net/user-data-bean";
import {LogList, State} from "../../main/bean/game/dash-board";
import {CopyParams, ObjectToMap} from "../../main/util/util";
import {PveBuff, PveLevel, PveNode} from "../../main/bean/net/pve-bean";

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        isFirstLogin: true,
        userResVo: {
            oil: 15000,
            ammo: 15000,
            steel: 15000,
            aluminium: 15000,
        },
        userVo: {
            oil: 10000,
            ammo: 10000,
            steel: 10000,
            aluminium: 10000,
            uid: "10010",
            username: "不咕鸟",
            level: 100,
            shipNumTop: 120,
            equipmentNumTop: 500
        },
        fleetVo: new Map<string, FleetVo>(),
        userShipVo: new Map<number, UserShipVO>(),
        pveExploreVo: new Map<string, PveExploreLevels>(),
        repairDockVo: new Array<RepairDockVo>(),
        packages: new Map<number, number>(),
        selfInfo: {
            version: "1.0.0.0",
            gameVersion: "5.0"
        },
        counter: {
            challengeNum: 300,
            battleNum: 300,
            nodeNum: 500,
            finishNum: 300,
            SLNum: 0,
            dpoilsNum: 50
        },
        taskList: [
            {
                name: "6-1炸鱼",
                num: "10/500",
                fleet: "第一舰队",
                state: true,
            },
            {
                name: "4-3偷铝",
                num: "0/500",
                fleet: "单猫队",
                state: true
            }
        ],
        logList: [
            {
                date: "1/21",
                time: "19:19:19",
                title: "主线程",
                dec: "主线程开启",
                type: ""
            },
            {
                date: "1/21",
                time: "19:20:19",
                title: "任务",
                dec: "开始任务: [6-1炸鱼]",
                type: "success-row"
            },
            {
                date: "1/21",
                time: "19:21:19",
                title: "出征",
                dec: `1-5 点 A 评价:SS 出船:<戈本>`,
                type: "",
            },
            {
                date: "1/21",
                time: "19:21:19",
                title: "出征",
                dec: `出新船 <戈本>`,
                type: "danger-row"
            },
        ],
        pve: {
            pveNode: {},
            pveLevel: {},
            pveBuff: {},
        }
    },
    mutations: {
        init(state: State) {
            console.log("[Vuex] 初始化储存");
            state.taskList = [];
            state.logList = [];
            state.counter = {
                challengeNum: 0,
                battleNum: 0,
                nodeNum: 0,
                finishNum: 0,
                SLNum: 0,
                dpoilsNum: 0
            }
        },
        setLog(state: State, log: LogList) {
            this.logList.push(log);
        },
        updateUserResVo(state: State, data: UserResVo) {
            state.userResVo = data;
        },
        updateUserVo(state: State, data: UserVo) {
            state.userVo = data;
            if (state.isFirstLogin === true) {
                CopyParams(state.userResVo, state.userVo, ['oil', 'ammo', 'steel', 'aluminium']);
                state.isFirstLogin = false;
            }
        },
        updateFleetVo(state: State, data) {
            state.fleetVo = ObjectToMap(data);
        },
        updateUserShipVo(state: State, data) {
            state.userShipVo = ObjectToMap(data);
        },
        updatePveExploreVo(state: State, data) {
            state.pveExploreVo = ObjectToMap(data);
        },
        updateRepairDockVo(state: State, data: Array<RepairDockVo>) {
            state.repairDockVo = data;
        },
        updatePackages(state: State, data) {
            state.packages = ObjectToMap(data);
        },
        updatePveData(state: State, data) {
            state.pve.pveBuff = data.pveBuff;
            state.pve.pveLevel = data.pveLevel;
            state.pve.pveNode = data.pveNode;
        }

    }
});
