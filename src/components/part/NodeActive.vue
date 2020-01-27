<template>
    <div class="drag-ul">
        <div class="drag-ul-flag">
            <div class="drag-il-flag"> {{flag}} </div>
            <el-tag :type='nodeTypeColor'
                    class="drag-il-tag">{{nodeTypeName}}</el-tag>
            <el-tag type="success" :class="{'drag-il-tag': true, 'drag-il-tag-hidden': canRoundabout!=1}">可迂回</el-tag>
            <el-tag type="warning" :class="{'drag-il-tag': true, 'drag-il-tag-hidden': hasNoBuff}">有战况</el-tag>
            <el-tag v-show="active">{{['', '单纵', '复纵', '轮形', '梯形', '单横'][format]}}</el-tag>

        </div>
        <div class="drag-ul-detail" v-show="active">
            <el-tag style="margin-left: 33px" type="success" :class="{'drag-il-tag': true, 'drag-il-tag-hidden': !night}" class="drag-il-tag">夜战</el-tag>
            <el-tag :class="{'drag-il-tag': true, 'drag-il-tag-hidden': !roundabout}" class="drag-il-tag">迂回</el-tag>
            <el-tag :class="{'drag-il-tag': true, 'drag-il-tag-hidden': !buff}" type="success" class="drag-il-tag">战况</el-tag>
            <el-tag :class="{'drag-il-tag': true, 'drag-il-tag-hidden': !detail}" class="drag-il-tag">特殊阵营SL</el-tag>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NodeActive",
        props: ['flag', 'nodeType', 'format', 'canRoundabout', 'hasNoBuff', 'active', 'night', 'roundabout', 'buff', 'detail'],
        data() {
            return {}
        },
        methods: {

        },
        computed: {
            nodeTypeName() {
                return {"1": "战斗点", "2": "BOSS点", "3": "资源点", "4": "待机点", "5": "收费站", "10": "航空点", "11": "BOSS点"}[this.nodeType.toString()]
            },
            nodeTypeColor() {
                return {"1": "", "2": "danger", "3": "success", "4": "info", "5": "warning", "10": "", "11": "danger"}[this.nodeType.toString()]
            }
        }
    }
</script>

<style scoped>
    .drag-ul {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        text-align: left;
    }

    .drag-il-flag {
        font-size: 20px;
        margin-left: 10px;
        line-height: 30px;
        float: left;
    }

    .drag-il-tag {
        height: 30px;
        margin-left: 10px;
    }

    .drag-il-flag+.drag-il-tag {
        margin-left: 10px;
    }


    .drag-ul-flag {
        height: 30px;
    }

    .drag-il-tag-hidden {
        visibility: hidden;
    }

    .drag-ul-detail {
        margin-top: 5px;
    }
</style>
