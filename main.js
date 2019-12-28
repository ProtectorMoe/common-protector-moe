const {app, BrowserWindow, ipcMain} = require("electron");


let windowsMain;
let worker;

app.on("ready", () => {
    // 启动主窗口
    windowsMain = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    windowsMain.loadURL("http://192.168.199.136:8080");
    windowsMain.webContents.openDevTools();
    // 启动工作窗口
    worker = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
    });
    worker.loadFile("./main/page/worker.html");
    worker.webContents.openDevTools();
});


// 转发第一次登录消息
ipcMain.on('login-first', (_, arg) => {
    worker.webContents.send('login-first', arg);
});
