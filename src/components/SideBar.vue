<template>
    <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item class="logo">
            <img src="../assets/img/logo.png" width="23" height="23" alt="logo">
            <span style="font-size: 22px"> 护萌宝<span style="font-size: 12px; background: #00bb00;border-radius: 15px;padding: 2px; color: white">beta</span>  </span>
        </el-menu-item>
        <el-menu-item index="1">主页</el-menu-item>
        <el-submenu index="2">
            <template slot="title">战斗</template>
            <el-menu-item index="2-1">出征</el-menu-item>
            <el-menu-item index="2-2">战役</el-menu-item>
            <el-menu-item index="2-3">演习</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">远征</el-menu-item>
        <el-menu-item index="4">修理</el-menu-item>
        <el-menu-item index="5">设置</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "SideBar",
        methods: {

        }
    }
</script>

<style scoped>
    .logo {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 20px;
        float: left;
        line-height: 60px;
    }
</style>
