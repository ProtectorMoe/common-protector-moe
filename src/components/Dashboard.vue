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
                            <div class="user-info-name">不咕鸟</div>
                            <div>我说我要咕，然后我咕了，这何尝是一种不咕</div>
                        </div>
                    </div>

                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="user-info-list">
                                <img src="../assets/img/oil.png" height="22" width="22">
                                <span>10000</span>
                                <span>+500</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/ammo.png" height="22" width="22">
                                <span>10000</span>
                                <span>+500</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/steel.png" height="22" width="22">
                                <span>10000</span>
                                <span>+500</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/aluminium.png" height="22" width="22">
                                <span>10000</span>
                                <span>+500</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="user-info-list">
                                <img src="../assets/img/ship.png" height="22" width="22">
                                <span>120 / 120</span>
                            </div>
                            <div class="user-info-list">
                                <img src="../assets/img/equipment.png" height="22" width="22">
                                <span>500 / 500</span>
                            </div>

                            <div class="user-version">
                                <table>
                                    <tr>
                                        <td style="width:50px;">Version</td>
                                        <td>1.0.0.0</td>
                                    </tr>
                                    <tr>
                                        <td>Game</td>
                                        <td>5.0</td>
                                    </tr>
                                </table>
                            </div>
                        </el-col>
                    </el-row>

                </el-card>

<!--                任务列表-->
                <el-card id="task-list" shadow="hover" :style="{height: taskListCard.height + 'px'}">
                    <div slot="header" class="clearfix">
                        <span>任务列表</span>
                    </div>
                    <el-table
                            :data="taskList"
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
                                    <div class="grid-num">300</div>
                                    <div>出征数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">500</div>
                                    <div>战斗数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <div class="grid-cont-right">
                                    <div class="grid-num">500</div>
                                    <div>节点数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <div class="grid-cont-right">
                                    <div class="grid-num">300</div>
                                    <div>完成数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">0</div>
                                    <div>SL数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <div class="grid-cont-right">
                                    <div class="grid-num">50</div>
                                    <div>今日战利品</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

<!--                日志-->
                <el-card id="log-list" shadow="hover" :style="{height: logCard.height + 'px'}">
                    <div slot="header" class="clearfix">
                        <span>日志</span>
                    </div>
                    <el-table
                            :data="logData"
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
            name: localStorage.getItem('ms_username'),
            taskListCard: {
                height: 352
            },
            logCard: {
                height: 503
            },
            taskList: [
                {
                    name: "6-1炸鱼",
                    num: "10/500",
                    fleet: "第一舰队",
                    state: true
                },
                {
                    name: "4-3偷铝",
                    num: "0/500",
                    fleet: "单猫队",
                    state: true
                }
            ],
            logData: [
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
                    type: ""
                },
                {
                    date: "1/21",
                    time: "19:21:19",
                    title: "出征",
                    dec: `出新船 <戈本>`,
                    type: "danger-row"
                },
            ]
        };
    },
    mounted() {
        window.addEventListener('resize', this.autoSetHeight);
        this.autoSetHeight();
    },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        getTableClass({row}) {
            return row.type
        },
        getTop(e) {
            let offset = e.offsetTop;
            if (e.offsetParent != null)
                offset += this.getTop(e.offsetParent);
            return offset;
        },
        autoSetHeight() {
            const task = document.getElementById('task-list');
            this.taskListCard.height = document.body.clientHeight - this.getTop(task) - 25;
            const log = document.getElementById('log-list');
            this.logCard.height = document.body.clientHeight - this.getTop(log) - 25;
        }
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

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
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
