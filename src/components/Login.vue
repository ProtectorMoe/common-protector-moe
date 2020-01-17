<template>
    <el-form class="login-form" label-width="60px">
        <el-form-item label="账号:">
            <el-input type="text" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
            <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="服务器">
            <el-select v-model="user.server" placeholder="请选择服务器">
                <el-option label="Android" value="0"></el-option>
                <el-option label="IOS" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="user = {username: '', password: '', server: '0'}">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                user: {
                    username: "posttester",
                    password: "123456",
                    server: "0"
                }
            }
        },
        methods: {
            login() {
                window.electron.ipcRenderer.send('login-first', this.user)
            }
        }
    }
</script>

<style scoped>
    .login-form {
        width: 300px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        padding: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
