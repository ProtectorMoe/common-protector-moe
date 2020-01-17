const {ipcRenderer} = require('electron');
import {GameLogin} from "../game/game-login";

const gameLogin = GameLogin.getInstance();

// 监听第一次登录数据
ipcRenderer.on('login-first', (_, arg) => {
    (async () => {
        gameLogin.initialize(arg.username, arg.password, arg.server);
        const serverList = await gameLogin.firstLogin();
        // TODO 显示选择服务器的对话框
    })().catch(reason => {
        console.error(reason)
    });
});
