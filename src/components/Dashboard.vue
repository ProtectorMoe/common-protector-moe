<template>
    <div>
        <el-row :gutter="20">
<!--            左边内容-->
            <el-col :span="10">
<!--                用户数据-->
                <el-card shadow="hover" class="mgb20" style="height:200px;">
                    <div class="user-info">
                        <el-avatar shape="square" src="http://q1.qlogo.cn/g?b=qq&nk=805757448&s=640" class="user-avator"/>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{$store.state.userVo.username}}</div>
                            <div>Lv.{{$store.state.userVo.level}}</div>
                        </div>
                    </div>

                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="user-info-list">
                                <img src="../assets/img/oil.png" height="22" width="22">
                                <span>{{$store.state.userResVo.oil}}</span>
                                <span>{{oilChange}}</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/ammo.png" height="22" width="22">
                                <span>{{$store.state.userResVo.ammo}}</span>
                                <span>{{ammoChange}}</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/steel.png" height="22" width="22">
                                <span>{{$store.state.userResVo.steel}}</span>
                                <span>{{steelChange}}</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/aluminium.png" height="22" width="22">
                                <span>{{$store.state.userResVo.aluminium}}</span>
                                <span>{{aluminiumChange}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="user-info-list">
                                <img src="../assets/img/ship.png" height="22" width="22">
                                <span>{{$store.state.userShipVo.size}} / {{$store.state.userVo.shipNumTop}}</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/equipment.png" height="22" width="22">
                                <span>{{500}} / {{$store.state.userVo.equipmentNumTop}}</span>
                            </div>

                            <div class="user-version">
                                <table>
                                    <tr>
                                        <td style="width:50px;">Version</td>
                                        <td>{{$store.state.selfInfo.version}}</td>
                                    </tr>
                                    <tr>
                                        <td>Game</td>
                                        <td>{{$store.state.selfInfo.gameVersion}}</td>
                                    </tr>
                                </table>
                            </div>
                        </el-col>
                    </el-row>

                </el-card>

<!--                任务列表-->
                <el-card id="task-list" shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>任务列表</span>
                    </div>
                    <el-table
                            :data="$store.state.taskList"
                            :show-header="false"
                            style="width: 100%">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.state"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="名称"
                                >
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="次数"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="fleet"
                                label="舰队"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                width="60"
                                fixed="right">
                            <template>
                                <i class="el-icon-top"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

<!--            右边内容-->
            <el-col :span="14">

<!--                统计数量-->
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.challengeNum}}</div>
                                    <div>出征数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.battleNum}}</div>
                                    <div>战斗数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.nodeNum}}</div>
                                    <div>节点数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.finishNum}}</div>
                                    <div>完成数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.SLNum}}</div>
                                    <div>SL数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{$store.state.counter.dpoilsNum}}</div>
                                    <div>今日战利品</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

<!--                日志-->
                <el-card id="log-list" shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>日志</span>
                    </div>
                    <el-table
                            :data="$store.state.logList"
                            :show-header="false"
                            :row-class-name="getTableClass"
                            style="width: 100%; overflow-x: hidden;">
                        <el-table-column
                                prop="date"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="dec">
                        </el-table-column>

                    </el-table>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'dashboard',
    data() {
        return {
        };
    },
    mounted() {
        window.addEventListener('resize', this.autoSetHeight);
        this.autoSetHeight();
    },
    methods: {
        getTableClass({row}) {
            return row.type
        },
        autoSetHeight() {
            function getTop(e) {
                let offset = e.offsetTop;
                if (e.offsetParent != null)
                    offset += getTop(e.offsetParent);
                return offset;
            }
            const task = document.getElementById('task-list');
            task.style.height = `${document.body.clientHeight - getTop(task) - 25}px`;
            const log = document.getElementById('log-list');
            log.style.height = `${document.body.clientHeight - getTop(log) - 25}px`
        }
    },
    computed: {
        oilChange() {
            const num = this.$store.state.userResVo.oil - this.$store.state.userVo.oil;
            return `${num >=0? "+": ""}${num}`
        },
        ammoChange() {
            const num = this.$store.state.userResVo.ammo - this.$store.state.userVo.ammo;
            return `${num >=0? "+": ""}${num}`
        },
        steelChange() {
            const num = this.$store.state.userResVo.steel - this.$store.state.userVo.steel;
            return `${num >=0? "+": ""}${num}`
        },
        aluminiumChange() {
            const num = this.$store.state.userResVo.aluminium - this.$store.state.userVo.aluminium;
            return `${num >=0? "+": ""}${num}`
        },
    }
};
</script>


<style scoped>

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}


.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}


.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}


.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 5px;
}

.user-avator {
    width: 50px;
    height: 50px;
}

.user-info-cont {
    padding-left: 30px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 20px;
    color: #222;
}

.user-info-list {
    margin-top: 2px;
    vertical-align: middle;
    line-height: 22px;
    font-size: 14px;
    color: #606266;
}

.user-info-list span,img {
    vertical-align: middle;
    margin-left: 20px;
    font-size: 16px;
}

.mgb20 {
    margin-bottom: 20px;
}

.user-version {
    position: absolute ;
    right: 1px;
    bottom: 1px;
    color: #C0C4CC;
    font-size: 12px;
}

</style>
