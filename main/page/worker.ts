const { ipcRenderer } = require('electron');

// 监听第一次登录数据
ipcRenderer.on('login-first', (_, arg) => {
    console.log(arg)
});
