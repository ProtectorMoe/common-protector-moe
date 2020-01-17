const { ipcRenderer } = require('electron');
import {GameLogin} from "../game/game-login";

const gameLogin = GameLogin.getInstance();

// 监听第一次登录数据
ipcRenderer.on('login-first', (_, arg) => {
    async function test() {
        console.log(arg);
        gameLogin.initialize(arg.username, arg.pwd, arg.server);
        gameLogin.firstLogin();
    }
    test();
});


