<template>
    <div id="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item
                    ><i class="el-icon-rank"></i> 任务</el-breadcrumb-item
                >
                <el-breadcrumb-item>出征</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="10" style="height: 100%">
            <el-col :span="8" class="el-col" style="height: 100%">
                <!-- 配置列表 -->
                <el-card
                    style="height: 99%; margin-bottom: 1px; text-align: left"
                >
                    <p style="text-align: center">配置列表</p>
                    <el-form ref="form" style="text-align: center">
                        <el-form-item>
                            <el-button size="mini" type="primary"
                                >新建</el-button
                            >
                            <el-button size="mini">下载</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 配置表格 -->
                    <el-table
                        id="path-table"
                        :data="pathList"
                        :show-header="false"
                        :height="pathHeight"
                        empty-text="无配置"
                        style="width: 100%; margin-top: -20px;"
                    >
                        <el-table-column prop="title" width="100">
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>{{ scope.row.desc }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">介绍</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-link
                                    class="el-icon-edit-outline table-link"
                                    @click="onTaskEdit(scope.$index)"
                                ></el-link>
                                <el-link
                                    class="el-icon-delete table-link"
                                    type="danger"
                                    @click="onTaskDelete(scope.$index)"
                                ></el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="8" class="el-col" style="height: 100%">
                <!-- 出征设置 -->
                <el-card
                    style="height: 99%; margin-bottom: 1px; text-align: left"
                >
                    <p style="text-align: center">出征设置</p>
                    <el-form ref="form" label-width="80px">
                        <el-form-item label="选中配置">
                            <el-tag>{{ form.config }}</el-tag>
                        </el-form-item>
                        <el-form-item v-model="form.fleet" label="出征舰队">
                            <el-select
                                class="w100"
                                placeholder="请选择舰队"
                                v-model="form.fleet"
                                @change="getFleetMember"
                            >
                                <el-option
                                    v-for="(fleet, index) in getFleet()"
                                    :label="fleet.title"
                                    :value="fleet.id"
                                    :key="index"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="执行次数">
                            <el-input-number
                                class="w100"
                                v-model="form.numMax"
                                controls-position="right"
                                :min="1"
                                :max="9999"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="修理方式">
                            <el-row :gutter="5">
                                <el-col
                                    :span="6"
                                    v-for="(repairData, index) in form.repair"
                                    :key="index"
                                >
                                    <el-popover
                                        placement="top"
                                        width="200"
                                        v-model="form.repair[index].visible"
                                    >
                                        <el-input-number
                                            v-model="form.repair[index].hp"
                                            :min="0"
                                            :max="100"
                                            label="少于等于hp修"
                                        ></el-input-number>
                                        <el-tag
                                            slot="reference"
                                            :type="
                                                getRepairText(repairData.hp)
                                                    .type
                                            "
                                            >{{
                                                getRepairText(repairData.hp)
                                                    .text
                                            }}</el-tag
                                        >
                                    </el-popover>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8" class="el-col" style="height: 100%">
                <!-- 舰队显示 -->
                <el-card
                    style="height: 99%; margin-bottom: 1px; text-align: left"
                >
                    <el-table
                        :data="form.fleetMember"
                        empty-text="暂无数据"
                        style="width: 100%; margin-top: -10px;"
                    >
                        <el-table-column label="名称" prop="title">
                        </el-table-column>
                        <el-table-column label="血量" prop="hp">
                        </el-table-column>
                        <el-table-column label="等级" prop="level">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script> 


export default {
    name: "challenge",
    mounted() {
        window.addEventListener("resize", this.autoSetHeight);
        // 加载配置
        if (window.global) {
            this.pathList = [];
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.removeAllListeners('getPathReply');
            ipcRenderer.on('getPathReply', (_, args) => {
                if (args.error == 0) {
                    this.pathList = args.value
                } else {
                    this.$notify.error({title: '错误', message: args.errmsg})
                }
            })
            ipcRenderer.send('getPath');
        }
        // 测试数据
        
        this.autoSetHeight();
    },
    data() {
        return {
            pathHeight: 200,

            pathList: [
                {
                    title: "测试1",
                    desc:
                        "这是一个测试这是一个测试这是一个测试这是一个测试这是一个测试这是一个测试这是一个测试"
                }
            ],

            form: {
                config: "测试1",
                numMax: "100",
                fleet: "",
                fleetMember: [],
                repair: [
                    { hp: 50, visible: false },
                    { hp: 50, visible: false },
                    { hp: 50, visible: false },
                    { hp: 50, visible: false },
                    { hp: 50, visible: false },
                    { hp: 50, visible: false }
                ]
            }
        };
    },
    methods: {
        getFleet() {
            const fleet = [];
            // 内置舰队
            this.$store.state.fleetVo.forEach(value => {
                if (parseInt(value.id) <= 4) {
                    fleet.push({
                        id: value.id,
                        title: value.title,
                        member: value.ships.map(value1 => {
                            const userShip = this.$store.state.userShipVo.get(
                                value1
                            );
                            const shipCard = this.$store.state.shipCardWu.get(
                                userShip.shipCid
                            ) || {
                                shipIndex: 1
                            };
                            return {
                                id: value1,
                                title: userShip.title,
                                shipIndex: parseInt(shipCard.shipIndex),
                                level: `Lv.${userShip.level}`,
                                hp: `${userShip.battleProps.hp}/${userShip.battlePropsMax.hp}`
                            };
                        })
                    });
                }
            });
            return fleet;
        },
        getRepairText(hp) {
            let text = "";
            let type = "";
            switch (hp) {
                case 0:
                    text = "不修";
                    break;
                case 25:
                    text = "大破修";
                    break;
                case 50:
                    text = "中破修";
                    break;
                default:
                    text = `≤${hp}%修`;
            }
            if (hp == 0) {
                type = "info";
            }
            if (hp > 0 && hp <= 25) {
                type = "danger";
            }
            if (hp > 25 && hp <= 50) {
                type = "warning";
            }
            if (hp > 50 && hp <= 100) {
                type = "success";
            }
            return { text, type };
        },
        getFleetMember() {
            this.form.fleetMember = this.getFleet().filter(
                value => value.id == this.form.fleet
            )[0].member;
        },
        autoSetHeight() {
            function getTop(e) {
                let offset = e.offsetTop;
                if (e.offsetParent != null) offset += getTop(e.offsetParent);
                return offset;
            }
            this.$nextTick(() => {
                const main = document.getElementById("main");
                main.style.height = `${document.body.clientHeight -
                    getTop(main) -
                    30}px`;

                const pathTable = document.getElementById("path-table");
                this.pathHeight =
                    document.body.clientHeight - getTop(pathTable) - 30;
            });
        },
        getShipImg(index) {
            return `http://update.protector.moe/ship/${index}.png`;
        },
        onTaskEdit(index) {
            this.$router.push({
                name: 'path-setting',
                params: {
                    path: this.pathList[index]
                }
            })
        },
        onTaskDelete() {}
    }
};
</script>

<style scoped>
#main {
    width: 100%;
}

.w100 {
    width: 100%;
}

.table-link {
    margin-left: 10px;
}

.tag-repair {
    margin-right: 5px;
}
</style>
