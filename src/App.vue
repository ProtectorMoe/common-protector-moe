<template>
    <el-container id="app">
        <el-header>
            <side-bar></side-bar>
        </el-header>
        <el-main>
            <login></login>
        </el-main>
    </el-container>
</template>

<script>
    import SideBar from "@/components/SideBar";
    import Login from "@/components/Login";
    export default {
        name: 'app',
        components: {
            SideBar,
            Login
        },
        data() {
            return {
                isLogin: true,
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
