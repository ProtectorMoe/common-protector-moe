const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

class APP {
    windowsMain;
    worker;
    private main = app;
    static WINDOWS_TO_WORKER = 0;
    static WORKER_TO_WINDOWS = 1;

    constructor() {
        this.main.on("ready", () => {
            // 启动主窗口
            this.windowsMain = new BrowserWindow({
                width: 1280,
                height: 720,
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: false
                }
            });
            this.windowsMain.loadURL("http://localhost:8080");
            this.windowsMain.webContents.openDevTools();
            // 启动工作窗口
            this.worker = new BrowserWindow({
                width: 1920,
                height: 1080,
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: false
                }
            });
            this.worker.loadFile("./main/page/worker.html");
            this.worker.webContents.openDevTools();

            this.rout();
        });
    }

    router(channel: string, direction: number) {
        ipcMain.on(channel, (_, arg) => {
            [this.worker, this.windowsMain][direction].webContents.send(
                channel,
                arg
            );
        });
    }

    rout() {
        this.router("loginText", APP.WORKER_TO_WINDOWS);
        this.router("loginFirstFinish", APP.WORKER_TO_WINDOWS);
        this.router("loginSecondFinish", APP.WORKER_TO_WINDOWS);
        this.router("updateUserResVo", APP.WORKER_TO_WINDOWS);
        this.router("updateUserVo", APP.WORKER_TO_WINDOWS);
        this.router("updateFleetVo", APP.WORKER_TO_WINDOWS);
        this.router("updateUserShipVo", APP.WORKER_TO_WINDOWS);
        this.router("updatePveExploreVo", APP.WORKER_TO_WINDOWS);
        this.router("updateRepairDockVo", APP.WORKER_TO_WINDOWS);
        this.router("updatePackages", APP.WORKER_TO_WINDOWS);
        this.router("setLog", APP.WORKER_TO_WINDOWS);
        this.router("setShipCardWu", APP.WORKER_TO_WINDOWS);

        this.router("loginFirst", APP.WINDOWS_TO_WORKER);
        this.router("loginSecond", APP.WINDOWS_TO_WORKER);
    }
}

const electron = new APP();

// 配置写入
ipcMain.on("writePath", (event, args) => {
    try {
        let file = path.join(process.cwd(), "path");
        if (!fs.existsSync(file)) {
            fs.mkdirSync(file);
        }
        file = path.join(file, args.file);
        fs.writeFileSync(file, args.data, { flag: "w" });
        event.reply("writePathCallback", { error: 0 });
    } catch (e) {
        event.reply("writePathCallback", {
            error: 1,
            errmsg: e.toString()
        });
    }
});

ipcMain.on("getPath", event => {
    const pathData = [];
    const root = path.join(process.cwd(), "path");
    const pa = fs.readdirSync(root);
    for (let value of pa) {
        try {
            const data = fs.readFileSync(path.join(root, value));
            pathData.push(JSON.parse(data));
        } catch (e) {
            event.reply("getPathReply", { error: 1, errmsg: e.toString() });
            return;
        }
    }
    event.reply("getPathReply", { error: 0, value: pathData });
});
