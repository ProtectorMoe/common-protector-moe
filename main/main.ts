const {app, BrowserWindow, ipcMain} = require("electron");

class APP {
    private windowsMain;
    private worker;
    private main = app;
    static WINDOWS_TO_WORKER = 0;
    static WORKER_TO_WINDOWS = 1;

    constructor() {
        this.main.on('ready', () => {
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

            ipcMain.on('updateRepairDockVo', (event, args) => {
                console.log('test', args)
            });

            this.rout();
        });
    }

    router(channel: string, direction: number) {
        ipcMain.on(channel, (_, arg) => {
            [this.worker, this.windowsMain][direction].webContents.send(channel, arg);
        });
    }

    rout() {
        this.router('loginText', APP.WORKER_TO_WINDOWS);
        this.router('loginFirstFinish', APP.WORKER_TO_WINDOWS);
        this.router('loginSecondFinish', APP.WORKER_TO_WINDOWS);

        this.router('updateUserResVo', APP.WORKER_TO_WINDOWS);
        this.router('updateUserVo', APP.WORKER_TO_WINDOWS);
        this.router('updateFleetVo', APP.WORKER_TO_WINDOWS);
        this.router('updateUserShipVo', APP.WORKER_TO_WINDOWS);
        this.router('updatePveExploreVo', APP.WORKER_TO_WINDOWS);
        this.router('updateRepairDockVo', APP.WORKER_TO_WINDOWS);
        this.router('updatePackages', APP.WORKER_TO_WINDOWS);
        this.router('setLog', APP.WORKER_TO_WINDOWS);
        this.router('loginFirst', APP.WINDOWS_TO_WORKER);
        this.router('loginSecond', APP.WINDOWS_TO_WORKER);


    }
}

new APP();
