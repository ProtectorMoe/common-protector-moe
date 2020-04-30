<template>
    <div class="container">
        <div class="ms-login">
            <div class="ms-title">护萌宝</div>
            <el-form
                :model="user"
                label-width="0px"
                class="ms-content"
                v-loading="loading"
                :element-loading-text="loadingText"
            >
                <el-form-item prop="username">
                    <el-input v-model="user.username" placeholder="username">
                        <el-button
                            slot="prepend"
                            icon="el-icon-user-solid"
                        ></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="user.password"
                    >
                        <el-button
                            slot="prepend"
                            icon="el-icon-unlock"
                        ></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="server">
                    <el-select
                        placeholder="请选择服务器"
                        v-model="defaultServer"
                        style="width: 100%"
                        value="0"
                    >
                        <el-option label="Android" value="0"></el-option>
                        <el-option label="IOS" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="login">
                    <div class="login-btn">
                        <el-button type="primary" @click="firstLogin"
                            >登录</el-button
                        >
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog
            title="请选择服务器"
            :visible.sync="openServerList"
            width="30%"
        >
            <el-select
                v-model="defaultServer"
                placeholder="请选择服务器"
                value="0"
            >
                <el-option
                    v-for="item in serverList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="secondLogin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Login",
    mounted() {
        if (window.global) {
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.removeAllListeners("loginFirstFinish");
            ipcRenderer.removeAllListeners("loginSecondFinish");
            ipcRenderer.removeAllListeners("loginText");
            const store = new window.Store();
            this.user = {
                username: store.get("user.username") || "",
                password: store.get("user.password") || "",
                serverType: store.get("user.serverType") || "0"
            };
            ipcRenderer.on("loginFirstFinish", (_, args) => {
                if (args.error == 0) {
                    this.defaultServer = args.value.defaultServer;
                    this.serverList = [];
                    args.value.serverList.forEach(value => {
                        if (value["hadRole"] === 1) {
                            this.serverList.push({
                                value: value.id,
                                label: value.name,
                                host: value.host
                            });
                        }
                    });
                    this.openServerList = true;
                } else {
                    this.$message.error(args.errmsg);
                    this.loading = false;
                }
            });
            ipcRenderer.on("loginSecondFinish", (_, args) => {
                if (args.error == 0) {
                    this.$router.push("/dashboard");
                } else {
                    this.$message.error(args.errmsg);
                    this.loading = false;
                }
            });
            ipcRenderer.on("loginText", (_, args) => {
                this.loadingText = args;
            });
        } else {
            console.log("浏览器调试模式");
        }
    },
    data() {
        return {
            loading: false,
            loadingText: "准备中...",
            openServerList: false,
            serverList: [],
            defaultServer: "0",
            user: {
                username: "",
                password: "",
                serverType: "0"
            }
        };
    },
    methods: {
        firstLogin() {
            this.loading = true;
            window.electron &&
                window.electron.ipcRenderer.send("loginFirst", this.user);
        },
        secondLogin() {
            this.openServerList = false;
            const host = this.serverList.filter(
                value => value.value === this.defaultServer
            )[0].host;
            window.electron &&
                window.electron.ipcRenderer.send("loginSecond", host);
        }
    },
    destroy() {
        if (window.global) {
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.removeAllListeners("loginFirstFinish");
            ipcRenderer.removeAllListeners("loginSecondFinish");
        }
    }
};
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    background: url(https://acg.toubiec.cn/acgurl?cid=acg&return=ssl) no-repeat
        center;
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #303133;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.6);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
