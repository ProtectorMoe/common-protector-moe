import {GameConfig} from "../game/game-config";
const {ipcRenderer} = require('electron');
import {GameLogin} from "../game/game-login";

const gameLogin = GameLogin.getInstance();
const gameConfig: GameConfig = GameConfig.getInstance();

// 监听第一次登录数据
ipcRenderer.on('login-first', (_, arg) => {
    (async () => {
        gameLogin.initialize(arg.username, arg.password, arg.serverType);
        const serverList = gameLogin.firstLogin();
        serverList.then(value => {
            gameConfig.userId = value.userId;
            ipcRenderer.send('login-first-finish', {error: 0, value})
        }).catch(reason => {
            ipcRenderer.send('login-first-finish', {error: 1, reason})
        })
    })().catch(reason => {
        console.error(reason)
    });
});

ipcRenderer.on('login-second', (_, host) => {
    (async () => {
        gameConfig.host = host;
        gameLogin.secondLogin().catch(reason => {
            console.error(reason)
        })
    })()
});
