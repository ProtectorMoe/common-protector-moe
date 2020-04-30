import { GameConfig } from "../game/game-config";
const { ipcRenderer } = require("electron");
import { GameLogin } from "../game/game-login";
import { Main } from "main/game/main";

const gameLogin = GameLogin.getInstance();
const gameConfig: GameConfig = GameConfig.getInstance();

// 监听第一次登录数据
ipcRenderer.on("loginFirst", (_, arg) => {
    (async () => {
        try {
            console.log(arg);
            gameLogin.initialize(arg.username, arg.password, arg.serverType);
            const serverList = await gameLogin.firstLogin();
            ipcRenderer.send("loginFirstFinish", {
                error: 0,
                value: serverList
            });
        } catch (e) {
            ipcRenderer.send("loginFirstFinish", {
                error: 1,
                errmsg: e.toString()
            });
        }
    })();
});

ipcRenderer.on("loginSecond", (_, host) => {
    (async () => {
        try {
            gameConfig.host = host;
            await gameLogin.secondLogin();
            ipcRenderer.send("loginSecondFinish", { error: 0 });
            // 启动主线程
            await Main.getInstance().mainThread();
        } catch (e) {
            ipcRenderer.send("loginSecondFinish", {
                error: 1,
                errmsg: e.toString
            });
        }
    })();
});
