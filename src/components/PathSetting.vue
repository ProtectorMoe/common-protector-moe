<template>
    <div id="main" class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-rank"></i> 任务</el-breadcrumb-item>
                <el-breadcrumb-item>出征</el-breadcrumb-item>
                <el-breadcrumb-item>地图设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-dialog
                title="大地图"
                :visible.sync="dialogVisible"
                width="70%">
            <img id="img-big-map" :src="imgSrc"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <div class="container inline-container">
            <el-row :gutter="10" style="height: 100%">
                <el-col id="card-col" :span="8" class="el-col" style="height: 100%">
                    <el-form ref="form"  label-width="80px" style="width: 100%">
                        <el-form-item label="游戏地图">
                            <el-select v-model="map" placeholder="请选择地图" value="101" @change="onMapChange" style="width: 100%">
                                <el-option v-for="(value, key) in $store.state.pve.pveLevel" :key="key" :label="value.title + ' | ' + value.subTitle" :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <img style="cursor:help"
                         id="img"
                         @click="openBigMap"
                         class="img-map"
                         width="426"
                         height="250"
                         :src="imgSrc"
                         alt="地图图片"/>
                    <div id="inactive-box" class="drag-box-item" style="margin-top: 10px">
                        <div class="item-title">不经过点</div>
                        <draggable id="inactive-container" v-model="pointInactive" @remove="removeHandle" :options="dragOptions">
                            <transition-group tag="div" id="inactive" class="item-ul">
                                <node-active v-for="item in pointInactive"
                                             :active="false"
                                             :flag="item.flag"
                                             :key="item.flag"
                                             :format="1"
                                             :node-type="item.nodeData.nodeType"
                                             :can-roundabout="item.nodeData.roundabout"
                                             :has-no-buff="item.nodeData.buff.length === 0">
                                </node-active>
                            </transition-group>
                        </draggable>
                    </div>
                </el-col>
                <el-col :span="8" style="height: 100%">
                    <div id="active-box" class="drag-box-item" style="height: 100%;">
                        <div class="item-title">经过点</div>
                        <draggable id="active-container" v-model="pointActive" @remove="removeHandle" @add="addHandle" :options="dragOptions">
                            <transition-group tag="div" id="active" class="item-ul">
                                <node-active v-for="item in pointActive"
                                             @click.native="addHandle(undefined, item.flag)"
                                             :active="true"
                                             :flag="item.flag"
                                             :key="item.flag"
                                             :node-type="item.nodeData.nodeType"
                                             :can-roundabout="item.nodeData.roundabout"
                                             :has-no-buff="item.nodeData.buff.length === 0"
                                             :format="item.format"
                                             :night="item.night"
                                             :roundabout="item.roundabout"
                                             :buff="item.buff != 0"
                                             :detail="item.detail.length != 0">
                                </node-active>
                            </transition-group>
                        </draggable>
                    </div>
                </el-col>
                <el-col :span="8" style="height: 100%">
                    <el-card style="height: 99%; margin-bottom: 1px; text-align: left">
                        <el-form label-width="40px">
                            <el-form-item label="当前">
                                <el-tag>{{form.flag}}</el-tag>
                            </el-form-item>
                            <el-form-item label="阵型">
                                <el-select v-model="form.format" placeholder="请选择阵型" style="width: 100%">
                                    <el-option label="单纵" value="1"></el-option>
                                    <el-option label="复纵" value="2"></el-option>
                                    <el-option label="轮形" value="3"></el-option>
                                    <el-option label="梯形" value="4"></el-option>
                                    <el-option label="单横" value="5"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="夜战">
                                <el-switch v-model="form.night" active-text="夜战" inactive-text="不夜战"></el-switch>
                            </el-form-item>
                            <el-form-item label="迂回">
                                <el-switch v-model="form.roundabout" active-text="迂回" inactive-text="不迂回"></el-switch>
                            </el-form-item>
                            <el-form-item label="资源">
                                <el-switch v-model="form.sl" active-text="资源点后SL" inactive-text="无行动"></el-switch>
                            </el-form-item>

                            <el-form-item label="战况">
                                <el-select v-model="form.buff" placeholder="请选择活动区域" style="width: 100%">
                                    <el-option label="无战况" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="敌舰">
                                <el-tag class="el-icon-plus" style="float: right"></el-tag>
                                <el-table
                                        :show-header="false"
                                        :data="form.detail"
                                        empty-text="点击 + 添加条件"
                                        style="width: 100%">
                                    <el-table-column
                                            width="80">
                                        <template slot-scope="scope">
                                            {{enemyList[scope.row.enemy]}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="40">
                                        <template slot-scope="scope">
                                            {{onGetNum(scope.row.num)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="100">
                                        <template slot-scope="scope">
                                            {{dealList[scope.row.deal]}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <el-link type="danger" @click="test(scope)" class="el-icon-delete-solid"></el-link>
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
    import draggable from 'vuedraggable'
    import NodeActive from "@/components/part/NodeActive";
    import {MapToObject} from "../../main/util/util";
    export default {
        name: 'path-setting',
        mounted() {
            window.addEventListener('resize', this.autoSetHeight);
            this.autoSetHeight();
            fetch('http://127.0.0.1:5000/')
                .then(_ => _.json())
                .then(pve => {
                    const pveNode = new Map();
                    const pveLevel = new Map();
                    const pveBuff = new Map();
                    pve.pveNode.forEach(value => pveNode.set(value.id, value));
                    pve.pveLevel.forEach(value => pveLevel.set(value.id, value));
                    pve.pveBuff.forEach(value => pveBuff.set(value.id, value));
                    this.$store.commit('updatePveData', {pveNode: MapToObject(pveNode), pveLevel: MapToObject(pveLevel), pveBuff: MapToObject(pveBuff)});
                    this.onMapChange('802');
                    this.$nextTick(this.autoSetHeight)
                })
        },
        data() {
            return {
                imgSrc: "",
                imgLoading: true,
                dialogVisible: false,
                dealList: ['SL', '换单纵', '换复纵', '换轮型', '换梯形', '换单横'],
                formatList: ['', '单纵', '复纵', '轮型', '梯形', '单横'],
                enemyList: ["", "航母", "轻母", "装母", "战列", "航战", "战巡", "重巡", "航巡", "雷巡",
                    "轻巡", "重炮", "驱逐", "潜母", "潜艇", "炮潜", "补给", "导驱", "防驱"],
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },


                nowPoint: 'A',
                map: '101',

                form: {
                    flag: '-',
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
                        buff: [{dec: "测试", id: "10001"}]
                    }
                },
                pointInactive: [],
                pointActive: [],
            }
        },
        components:{
            NodeActive,
            draggable
        },
        methods: {
            removeHandle(event){
                this.$message.success(`点${this.getFlag(event)} 已被 ${event.to.id == 'active'?"添加":"删除"}`);
            },
            onGetNum(num) {
                return num<=6? (" ≥ " + num + " "): (" < " + (num-6) + " ");
            },
            addHandle(event, flag) {
                flag = flag || this.getFlag(event);
                console.log(flag);
                this.form = this.pointActive.filter(value => value.flag == flag)[0]
            },
            getFlag(event) {
                return event.item.innerText.trimRight()[0]
            },
            autoSetHeight() {
                function getTop(e) {
                    let offset = e.offsetTop;
                    if (e.offsetParent != null)
                        offset += getTop(e.offsetParent);
                    return offset;
                }
                const main = document.getElementById('main');
                main.style.height = `${document.body.clientHeight - getTop(main) - 25}px`;
                const inactiveBox = document.getElementById('inactive-box');
                const card = document.getElementById('card-col');
                inactiveBox.style.height = `${card.offsetHeight - inactiveBox.offsetTop}px`;

                const inactiveContainer = document.getElementById('inactive-container');
                const activeContainer = document.getElementById('active-container');
                inactiveContainer.style.height = `${card.offsetHeight - inactiveBox.offsetTop - 50}px`;
                activeContainer.style.height = `${card.offsetHeight - activeContainer.offsetTop - 15}px`;

                const img = document.getElementById('img-big-map');
                if (img)
                    img.style.width = `${parseInt(document.body.clientWidth * 0.6)}px`;

            },
            test(t) {
                console.log(t);
            },
            onMapChange() {
                this.pointInactive = [];
                this.imgSrc = "http://update.protector.moe/map/⑨⑨⑨.png".replace("⑨⑨⑨", this.map);
                Object.values(this.$store.state.pve.pveNode)
                    .filter(value => value.pveLevelId == this.map && value.flag != "")
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
                                buff: value.buff.map(value1 => {return {
                                    id: value1,
                                    title: this.$store.state.pve.pveBuff[value1.toString()].desc.replace(/\^.{17}/g, " ").trim()
                                }})
                            }
                        })
                    });
            },
            openBigMap() {
                this.dialogVisible = true;
                this.$nextTick(this.autoSetHeight)
            }
        }
    }

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

    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        height: 100%;
        padding: 0 8px 8px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
</style>
