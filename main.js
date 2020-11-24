// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, globalShortcut, ipcMain} = require('electron');
// import { screen } from 'electron'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

app.commandLine.appendSwitch('ignore-certificate-errors'); // 忽略 https 校验错误

const appConfig = require('./appConfig');
const url = appConfig.url;
const prod = appConfig.prod;

const path = require('path');


function createWindow() {
    // var size = screen.getPrimaryDisplay().workAreaSize
    // var height = parseInt(size.height * 0.8)
    // Create the browser window.
    mainWindow = new BrowserWindow({
        x: 5,
        y: 10,
        width: 336,
        maxWidth: 616,
        minWidth: 336,
        height: 768,
        maxHeight: 1080,
        minHeight: 420,
        autoHideMenuBar: true,
        frame: true,
        zoomlimit: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        }
    });
    mainWindow.webContents.session.setPreloads([path.join(__dirname, 'preload-get-display-media-polyfill.js')]);
    mainWindow.webContents.session.setPermissionCheckHandler(async (webContents, permission, details) => {
        return true
    });
    mainWindow.webContents.session.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
        callback(true)
    });

    // 保证 preload-get-display-media-polyfill.js 加载完成，再加载页面
    setTimeout(() => {
        mainWindow.loadURL(url);
    });

    if (!prod) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }

    Menu.setApplicationMenu(null);

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // 监听右键事件
    mainWindow.webContents.on("context-menu", function (e, props) {
        let menu_arr = [
            {
                label: "检查",
                role: 'toggledevtools'
            },
            {
                label: "刷新",
                role: 'reload'
            }
        ];
        Menu.buildFromTemplate(menu_arr).popup(mainWindow);

    });


    const args = [];
    if (!app.isPackaged) {
        args.push(path.resolve(process.argv[1]));
    }
    args.push('--');
    const PROTOCOL = 'hongqicsApp';
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);

    // handleArgv(process.argv);

    app.on('second-instance', (event, argv) => {
        if (process.platform === 'win32') {
            // Windows
            console.log('second-instance', event, argv)
        }
    });

    // macOS
    app.on('open-url', (event, urlStr) => {
        console.log('open-url', event, urlStr)
    });


}

// // 当Electron完成时调用此方法
// // 初始化并准备创建浏览器窗口.
// // 有些API只能在事件发生后使用.
// app.on('ready', createWindow)

// app.on('activate', function () {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// app.on('window-all-closed',function (){
//   if(process.platform !== 'darwin'){
//     app.quit();
//   }
// })


// 限制只可以打开一个应用, 4.x的文档
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            mainWindow.show();
        }
    });
    app.on('ready', createWindow);
    app.on('activate', function () {
        // 在macOS上，通常在应用程序中重新创建一个窗口
        // 停靠图标被单击，并且没有其他窗口打开.
        if (mainWindow === null) {
            createWindow();
        }
    });
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

// 在这个文件中，你可以包含你的应用程序的其他特定主进程
// 代码。您也可以将它们放在单独的文件中，并在此处要求它们

ipcMain.on('min', e => mainWindow.minimize());
ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize()
    }
});
ipcMain.on('close', e => mainWindow.close());
