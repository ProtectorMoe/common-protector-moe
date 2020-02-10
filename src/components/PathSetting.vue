<template>
    <div id="main" class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item
                    ><i class="el-icon-rank"></i> 任务</el-breadcrumb-item
                >
                <el-breadcrumb-item>出征</el-breadcrumb-item>
                <el-breadcrumb-item>地图设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-dialog title="大地图" :visible.sync="dialogVisible" width="70%">
            <img id="img-big-map" :src="imgSrc" alt="大地图" />
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <el-dialog title="保存设置" :visible.sync="saveVisible" width="50%">
            <el-form ref="form" label-width="80px">
                <el-form-item label="配置名称">
                    <el-input v-model="title" placeholder="新建配置"></el-input>
                </el-form-item>
                <el-form-item label="配置描述">
                    <el-input
                        type="textarea"
                        v-model="desc"
                        placeholder="无描述(可选)"
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSaveConfig"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <el-dialog title="选择敌人" :visible.sync="showEnemy" width="20%">
            <span>
                <el-select
                    v-model="enemyForm.enemy"
                    placeholder="敌人"
                    style="display: inline"
                >
                    <el-option label="航母" value="1"></el-option>
                    <el-option label="轻母" value="2"></el-option>
                    <el-option label="装母" value="3"></el-option>
                    <el-option label="战列" value="4"></el-option>
                    <el-option label="航战" value="5"></el-option>
                    <el-option label="战巡" value="6"></el-option>
                    <el-option label="重巡" value="7"></el-option>
                    <el-option label="航巡" value="8"></el-option>
                    <el-option label="雷巡" value="9"></el-option>
                    <el-option label="轻巡" value="10"></el-option>
                    <el-option label="重炮" value="11"></el-option>
                    <el-option label="驱逐" value="12"></el-option>
                    <el-option label="潜母" value="13"></el-option>
                    <el-option label="潜艇" value="14"></el-option>
                    <el-option label="炮潜" value="15"></el-option>
                    <el-option label="补给" value="16"></el-option>
                    <el-option label="导驱" value="17"></el-option>
                    <el-option label="防驱" value="18"></el-option>
                </el-select>
                <el-select
                    v-model="enemyForm.num"
                    placeholder="数量"
                    style="display: inline"
                >
                    <el-option label="≥ 1" value="1"></el-option>
                    <el-option label="≥ 2" value="2"></el-option>
                    <el-option label="≥ 3" value="3"></el-option>
                    <el-option label="≥ 4" value="4"></el-option>
                    <el-option label="≥ 5" value="5"></el-option>
                    <el-option label="≥ 6" value="6"></el-option>
                    <el-option label="< 1" value="7"></el-option>
                    <el-option label="< 2" value="8"></el-option>
                    <el-option label="< 3" value="9"></el-option>
                    <el-option label="< 4" value="10"></el-option>
                    <el-option label="< 5" value="11"></el-option>
                    <el-option label="< 6" value="12"></el-option>
                </el-select>
                <el-select
                    v-model="enemyForm.deal"
                    placeholder="处理方式"
                    style="display: inline"
                >
                    <el-option label="SL" value="0"></el-option>
                    <el-option label="换单纵" value="1"></el-option>
                    <el-option label="换复纵" value="2"></el-option>
                    <el-option label="换轮型" value="3"></el-option>
                    <el-option label="换梯形" value="4"></el-option>
                    <el-option label="换单横" value="5"></el-option>
                </el-select>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onAddEnemy">确 定</el-button>
            </span>
        </el-dialog>

        <div class="container inline-container">
            <el-button
                @click="onSave"
                type="success"
                icon="el-icon-check"
                style="position: absolute; right: 7%; bottom: 10%; z-index:99"
            >
                保存</el-button
            >
            <el-row :gutter="10" style="height: 100%">
                <el-col
                    id="card-col"
                    :span="8"
                    class="el-col"
                    style="height: 100%"
                >
                    <el-form ref="form" label-width="80px" style="width: 100%">
                        <el-form-item label="游戏地图">
                            <el-select
                                v-model="map"
                                placeholder="请选择地图"
                                value="101"
                                @change="onMapChange"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="(value, key) in $store.state.pve
                                        .pveLevel"
                                    :key="key"
                                    :label="
                                        value.title + ' | ' + value.subTitle
                                    "
                                    :value="key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-image
                        style="cursor:help"
                        v-loading="imgLoading"
                        id="img"
                        @click="openBigMap"
                        class="img-map"
                        :src="imgSrc"
                        @load="imgLoaded"
                        alt="地图图片"
                    />
                    <div
                        id="inactive-box"
                        class="drag-box-item"
                        style="margin-top: 10px"
                    >
                        <div class="item-title">不经过点</div>
                        <draggable
                            id="inactive-container"
                            v-model="pointInactive"
                            :options="dragOptions"
                        >
                            <transition-group
                                tag="div"
                                id="inactive"
                                class="item-ul"
                            >
                                <node-active
                                    v-for="item in pointInactive"
                                    :active="false"
                                    :flag="item.flag"
                                    :key="item.flag"
                                    :format="1"
                                    :node-type="item.nodeData.nodeType"
                                    :can-roundabout="item.nodeData.roundabout"
                                    :has-no-buff="
                                        item.nodeData.buff.length === 0
                                    "
                                >
                                </node-active>
                            </transition-group>
                        </draggable>
                    </div>
                </el-col>
                <el-col :span="8" style="height: 100%">
                    <div
                        id="active-box"
                        class="drag-box-item"
                        style="height: 100%;"
                    >
                        <div class="item-title">经过点</div>
                        <draggable
                            id="active-container"
                            v-model="pointActive"
                            @add="addHandle"
                            :options="dragOptions"
                        >
                            <transition-group
                                tag="div"
                                id="active"
                                class="item-ul"
                            >
                                <node-active
                                    v-for="item in pointActive"
                                    @click.native="
                                        addHandle(undefined, item.flag)
                                    "
                                    :active="true"
                                    :flag="item.flag"
                                    :key="item.flag"
                                    :node-type="item.nodeData.nodeType"
                                    :can-roundabout="item.nodeData.roundabout"
                                    :has-no-buff="
                                        item.nodeData.buff.length === 0
                                    "
                                    :format="item.format"
                                    :night="item.night"
                                    :roundabout="item.roundabout"
                                    :buff="item.buff != 0"
                                    :detail="item.detail.length != 0"
                                >
                                </node-active>
                            </transition-group>
                        </draggable>
                    </div>
                </el-col>
                <el-col :span="8" style="height: 100%">
                    <el-card
                        style="height: 99%; margin-bottom: 1px; text-align: left"
                    >
                        <el-form label-width="40px">
                            <el-form-item label="当前">
                                <el-tag>{{ form.flag }}</el-tag>
                            </el-form-item>
                            <el-form-item label="阵型">
                                <el-select
                                    v-model="form.format"
                                    placeholder="请选择阵型"
                                    style="width: 100%"
                                    :disabled="
                                        !(
                                            form.nodeData.nodeType == 1 ||
                                            form.nodeData.nodeType == 2 ||
                                            form.nodeData.nodeType == 10 ||
                                            form.nodeData.nodeType == 11
                                        )
                                    "
                                >
                                    <el-option
                                        label="单纵"
                                        value="1"
                                    ></el-option>
                                    <el-option
                                        label="复纵"
                                        value="2"
                                    ></el-option>
                                    <el-option
                                        label="轮形"
                                        value="3"
                                    ></el-option>
                                    <el-option
                                        label="梯形"
                                        value="4"
                                    ></el-option>
                                    <el-option
                                        label="单横"
                                        value="5"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="夜战">
                                <el-switch
                                    v-model="form.night"
                                    active-text="夜战"
                                    inactive-text="不夜战"
                                    :disabled="
                                        !(
                                            form.nodeData.nodeType == 1 ||
                                            form.nodeData.nodeType == 2 ||
                                            form.nodeData.nodeType == 10 ||
                                            form.nodeData.nodeType == 11
                                        )
                                    "
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="迂回">
                                <el-switch
                                    v-model="form.roundabout"
                                    active-text="迂回"
                                    inactive-text="不迂回"
                                    :disabled="form.nodeData.roundabout == 0"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="资源">
                                <el-switch
                                    v-model="form.sl"
                                    active-text="资源点后SL"
                                    inactive-text="无行动"
                                    :disabled="
                                        !(
                                            form.nodeData.nodeType == 3 ||
                                            form.nodeData.nodeType == 5
                                        )
                                    "
                                >
                                </el-switch>
                            </el-form-item>

                            <el-form-item label="战况">
                                <el-select
                                    v-model="form.buff"
                                    placeholder="请选择活动区域"
                                    style="width: 100%"
                                >
                                    <el-option
                                        label="无战况"
                                        value="0"
                                    ></el-option>
                                    <el-option
                                        v-for="buff in form.nodeData.buff"
                                        :key="buff.id"
                                        :label="buff.title"
                                        :value="buff.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="敌舰">
                                <el-link
                                    @click="showEnemy = true"
                                    type="primary"
                                    class="el-icon-plus"
                                    style="float: right"
                                    :disabled="
                                        !(
                                            form.nodeData.nodeType == 1 ||
                                            form.nodeData.nodeType == 2 ||
                                            form.nodeData.nodeType == 10 ||
                                            form.nodeData.nodeType == 11
                                        )
                                    "
                                ></el-link>
                                <el-table
                                    :show-header="false"
                                    :data="form.detail"
                                    empty-text="点击 + 添加条件"
                                    style="width: 100%"
                                >
                                    <el-table-column width="80">
                                        <template slot-scope="scope">
                                            {{ enemyList[scope.row.enemy] }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="40">
                                        <template slot-scope="scope">
                                            {{ onGetNum(scope.row.num) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="100">
                                        <template slot-scope="scope">
                                            {{ dealList[scope.row.deal] }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <el-link
                                                type="danger"
                                                @click="
                                                    $delete(
                                                        form.detail,
                                                        scope.$index
                                                    )
                                                "
                                                class="el-icon-delete-solid"
                                            ></el-link>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import NodeActive from "@/components/part/NodeActive";

export default {
    name: "path-setting",
    mounted() {
        window.addEventListener("resize", this.autoSetHeight);
        this.autoSetHeight();
        // electron模式注册ipc
        if (window.global) {
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.removeAllListeners("writePathCallback");
            ipcRenderer.on("writePathCallback", (_, args) => {
                if (args.error == 0) {
                    this.$router.push("challenge");
                } else {
                    this.$notify.error({ title: "错误", message: args.errmsg });
                }
            });
        }
        // 验证是否有数据发送
        if (Object.keys(this.$route.params).length != 0) {
            const path = this.$route.params.path;
            this.title = path.title;
            this.desc = path.desc;
            this.map = path.map;
            this.onMapChange(path.map);
            const pointList = Object.keys(path.detail);
            for (const index in this.pointInactive) {
                const point = this.pointInactive[index];
                const flag = point.flag;
                if (pointList.indexOf(flag) != -1) {
                    point.night = path.detail[flag].night;
                    point.roundabout = path.detail[flag].round_about;
                    point.buff = path.detail[flag].buff;
                    point.sl = path.detail[flag].sl;
                    point.detail = path.detail[flag].detail;
                    point.format = path.detail[flag].format;
                    this.pointActive.push(point);
                    this.pointInactive.slice(index, 1);
                }
            }
        } else {
            this.onMapChange("101");
        }
    },
    data() {
        return {
            imgSrc: "",
            imgLoading: false,
            dialogVisible: false,
            saveVisible: false,
            showEnemy: false,
            dealList: ["SL", "换单纵", "换复纵", "换轮型", "换梯形", "换单横"],
            formatList: ["", "单纵", "复纵", "轮型", "梯形", "单横"],
            enemyList: [
                "",
                "航母",
                "轻母",
                "装母",
                "战列",
                "航战",
                "战巡",
                "重巡",
                "航巡",
                "雷巡",
                "轻巡",
                "重炮",
                "驱逐",
                "潜母",
                "潜艇",
                "炮潜",
                "补给",
                "导驱",
                "防驱"
            ],
            dragOptions: {
                animation: 120,
                scroll: true,
                group: "sortlist",
                ghostClass: "ghost-style"
            },
            enemyForm: {
                enemy: "1",
                num: "1",
                deal: "1"
            },
            nowPoint: "A",
            form: {
                flag: "-",
                night: false,
                roundabout: false,
                sl: false,
                detail: [],
                format: "1",
                buff: "0",
                spyFailSl: false,
                nodeData: {
                    nodeType: "2",
                    roundabout: "0",
                    buff: []
                }
            },

            title: "test",
            map: "101",
            desc: "",
            pointInactive: [],
            pointActive: []
        };
    },
    components: {
        NodeActive,
        draggable
    },
    methods: {
        onGetNum(num) {
            return num <= 6 ? " ≥ " + num + " " : " < " + (num - 6) + " ";
        },
        addHandle(event, flag) {
            flag = flag || this.getFlag(event);
            this.form = this.pointActive.filter(value => value.flag == flag)[0];
        },
        getFlag(event) {
            return event.item.innerText.trim()[0];
        },
        autoSetHeight() {
            function getTop(e) {
                let offset = e.offsetTop;
                if (e.offsetParent != null) offset += getTop(e.offsetParent);
                return offset;
            }
            this.$nextTick(() => {
                try {
                    const main = document.getElementById("main");
                    main.style.height = `${document.body.clientHeight -
                        getTop(main) -
                        25}px`;
                    const inactiveBox = document.getElementById("inactive-box");
                    const card = document.getElementById("card-col");
                    inactiveBox.style.height = `${card.offsetHeight -
                        inactiveBox.offsetTop}px`;

                    const inactiveContainer = document.getElementById(
                        "inactive-container"
                    );
                    const activeContainer = document.getElementById(
                        "active-container"
                    );
                    inactiveContainer.style.height = `${card.offsetHeight -
                        inactiveBox.offsetTop -
                        50}px`;
                    activeContainer.style.height = `${card.offsetHeight -
                        activeContainer.offsetTop -
                        15}px`;

                    const img = document.getElementById("img-big-map");
                    if (img)
                        img.style.width = `${parseInt(
                            document.body.clientWidth * 0.6
                        )}px`;
                } catch (e) {
                    console.log(e);
                }
            });
        },
        onAddEnemy() {
            this.form.detail.push(this.enemyForm);
            this.showEnemy = false;
        },
        onMapChange() {
            this.pointInactive = [];
            this.pointActive = [];
            this.imgLoading = true;
            this.imgSrc = "http://update.protector.moe/map/⑨⑨⑨.png".replace(
                "⑨⑨⑨",
                this.map
            );
            Object.values(this.$store.state.pve.pveNode)
                .filter(
                    value => value.pveLevelId == this.map && value.flag != ""
                )
                .forEach(value => {
                    this.pointInactive.push({
                        flag: value.flag,
                        night: false,
                        roundabout: false,
                        sl: false,
                        detail: [],
                        format: "1",
                        buff: "0",
                        spyFailSl: false,
                        nodeData: {
                            nodeType: value.nodeType,
                            roundabout: value.roundabout,
                            buff: value.buff.map(value1 => {
                                return {
                                    id: value1,
                                    title: this.$store.state.pve.pveBuff[
                                        value1.toString()
                                    ].desc
                                        .replace(/\^.{17}/g, " ")
                                        .trim()
                                };
                            })
                        }
                    });
                });
            this.autoSetHeight();
        },
        openBigMap() {
            this.dialogVisible = true;
            this.autoSetHeight();
        },
        imgLoaded() {
            this.imgLoading = false;
            this.autoSetHeight();
        },
        onSave() {
            if (this.pointActive.length == 0) {
                this.$notify.error({
                    title: "错误",
                    message: "您没有添加任何点"
                });
                return;
            }
            const buffEmpty = this.pointActive.filter(
                value => value.nodeData.buff.length > 0 && value.buff == 0
            );
            if (buffEmpty.length > 0) {
                this.$notify.error({
                    title: "错误",
                    message: buffEmpty[0].flag + "点 还没有选择战况"
                });
                return;
            }
            this.saveVisible = true;
        },
        onSaveConfig() {
            if (this.title.trim().length == 0) {
                this.$notify.error({ title: "错误", message: "标题不能为空" });
                return;
            }
            this.saveVisible = false;
            const obj = {
                title: this.title,
                map: this.map,
                desc: this.desc,
                detail: {}
            };
            this.pointActive.forEach(value => {
                obj.detail[value.flag] = {
                    buff: value.buff,
                    detail: value.detail,
                    format: value.format,
                    night: value.night,
                    round_about: value.roundabout
                };
            });
            if (window.global) {
                window.electron.ipcRenderer.send("writePath", {
                    file: this.title + ".map",
                    data: JSON.stringify(obj)
                });
            }
        }
    }
};
</script>

<style scoped>
.main {
    width: 100%;
}

.inline-container {
    width: 95%;
    height: 88%;
}

.img-map {
    width: 100%;
}

.el-col {
    text-align: center;
}

.drag-box-item {
    background-color: #eff1f5;
    border-radius: 6px;
    border: 1px #e1e4e8 solid;
}

.item-title {
    padding: 8px 8px 8px 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-weight: 600;
}
.item-ul {
    height: 100%;
    padding: 0 8px 8px;
    overflow-y: scroll;
}
</style>
