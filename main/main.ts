const {app, BrowserWindow, ipcMain} = require("electron");

class APP {
    private windowsMain;
    private worker;
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
                },
            });
            this.worker.loadFile("./main/page/worker.html");
            this.worker.webContents.openDevTools();
            this.rout();

        });
    }

    router(channel: string, direction: number) {
        ipcMain.on(channel, (_, arg) => {
            [this.worker, this.windowsMain][direction].webContents.send(channel, arg);
        });
    }

    rout() {
        this.router('login-first', APP.WINDOWS_TO_WORKER);
        this.router('login-first-finish', APP.WORKER_TO_WINDOWS);
        this.router('login-second', APP.WINDOWS_TO_WORKER);
    }
}

new APP();
