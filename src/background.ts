'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import SystemTray from './utils/SystemTray';
// import MainHandle from './platform/MainHandle';
import { funcRecoveryDev, funcVersionUpdate } from './utils/winUtils';

import log from 'electron-log';
import Store from 'electron-store';
import getMAC from './libs/getMac';
import { autoUpdater } from 'electron-updater';
import { initServe } from './server';

const feedUrl = `http://172.28.102.87:8080/${process.platform}`;
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.console.level = 'silly';
// 判断是否开发环境
const isDevelopment = process.env.NODE_ENV !== 'production';
// 数据存储
const store = new Store({ encryptionKey: 'gree1234qwe!2345' });
const macUnion = store.get('macUnion');
const userToken = store.get('userToken');
// 主窗口
let win: BrowserWindow | null;
let winRecoveryDev: BrowserWindow;
let winVersion: BrowserWindow;
let winCancellation: BrowserWindow;
let webContents: any;
let timer: any;
// 判断应用是否已经启动
const gotTheLock = app.requestSingleInstanceLock();
// 方案必须在应用程序准备就绪之前注册
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);
app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath
});

// 判断应用是否二次启动
if (!gotTheLock) {
    // @ts-ignore

    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            log.info('二次启动程序');
            if (win.isMinimized()) {
                win.restore();
            }
            win.show();
            win.focus();
        }
    });
}
// 托盘
let tray: SystemTray | null = null;
let appQuit = false;
// let mainHandle: MainHandle | null = null;

function createWindow() {
    log.silly('创建主窗口');
    log.info('当前计算机的MAC地址：', getMAC());
    store.set('currentMac', getMAC());
    win = new BrowserWindow({
        width: 596,
        height: 396,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        }
    });
    loadAppView(win);
    win.on('ready-to-show', () => {
        if (win) {
            win.show(); // 初始化后再显示
        }
    });
    win.on('close', (e: any) => {
        if (win) {
            win.hide();
            win.setSkipTaskbar(false);
        }
        if (!appQuit) {
            e.preventDefault();
        }
    });
    win.on('closed', (e: any) => {
        win = null;
    });

    // mainHandle = new MainHandle(win);

    webContents = win.webContents;
    webContents.on('crashed', (err: any, killed: any) => {
        log.error('渲染进程', err, killed);
    });
    webContents.on('devtools-opened', () => {
        log.silly('devtools-opened');
    });
    webContents.on('devtools-closed', () => {
        log.silly('devtools-closed');
    });
    webContents.on('devtools-focused', () => {
        log.silly('devtools-focused');
    });
    // 启动HTTP服务
    initServe(win);
}
// 隐藏菜单栏
Menu.setApplicationMenu(null);
// 关闭窗口，退出应用
app.on('window-all-closed', () => {
    log.silly('退出应用');
    appQuit = false;
    if (timer) {
        clearInterval(timer);
    }
    if (tray) {
        tray.destroy();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            // await installVueDevtools();
        } catch (e) {
            log.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
    checkForUpdates();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
process.on('uncaughtException', (err) => {
    log.error(err.stack);
});
app.on('renderer-process-crashed', (e) => {
    log.error('renderer-process-crashed', e);
});
app.on('gpu-process-crashed', (e) => {
    log.error('gpu-process-crashed', e);
});
const unlogin = {
    label: '未登录',
    click() {
        if (win) {
            win.setSize(596, 396);
            win.isVisible() ? win.hide() : win.show();
            win.isVisible()
                ? win.setSkipTaskbar(false)
                : win.setSkipTaskbar(true);
            win.webContents.send('router', { path: '/login' });

            log.info('点击未登录');
        }
    }
};
const logout = {
    label: '退出应用',
    click() {
        BrowserWindow.getAllWindows().forEach((win) => {
            win.removeAllListeners();
        });
        // app.quit()
        app.exit(0);
    }
};
const cancellation = {
    label: '注销登录',
    click() {
        funcCancellation();
    }
};

function funcCancellation() {
    if (winCancellation && !winCancellation.isDestroyed()) {
        if (winCancellation.isVisible()) {
            winCancellation.focus();
        } else {
            winCancellation.show();
            winCancellation.setSkipTaskbar(false);
        }
    } else {
        winCancellation = new BrowserWindow({
            width: 640,
            height: 350,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: true
            }
            // parent: win // win是主窗口
        });
        ipcMain.on('determine-logout', (e: any, val: any) => {
            store.delete('userToken');
            const trayMenu = Menu.buildFromTemplate([unlogin, logout]);
            if (tray) {
                tray.setContextMenu(trayMenu);
            }
            winCancellation.hide();
            BrowserWindow.getAllWindows().forEach((w) => {
                if (win) {
                    if (win.id !== w.id) {
                        w.removeAllListeners();
                        w.close();
                    } else {
                        win.setSize(596, 396);
                        win.webContents.send('router', { path: '/login' });
                    }
                }
            });
        });
        ipcMain.on('close-logout', (e: any, val: any) => {
            winCancellation.hide();
        });
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            winCancellation
                .loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
                .then(() => {
                    winCancellation.webContents.send('router', {
                        path: '/logout'
                    });
                });
        } else {
            // win.webContents.openDevTools();
            createProtocol('app');
            // Load the index.html when not in development
            winCancellation.loadURL('app://./index.html').then(() => {
                winCancellation.webContents.send('router', { path: '/logout' });
            });
        }
    }
}

const devDetail = {
    label: '查看设备信息',
    click() {
        if (win) {
            win.webContents.send('router', { path: '/main/dev' });
            if (win.isVisible()) {
                win.focus();
            } else {
                win.show();
                win.setSkipTaskbar(false);
            }
        }
    }
};
const versionUpdate = {
    label: '检测更新',
    click() {
        autoUpdater.checkForUpdates().then((updateCheckResult: any) => {
            store.set('sysVersion', app.getVersion());
            store.set('newVersion', updateCheckResult.versionInfo.version);
            funcVersionUpdate(winVersion);
        });
    }
};

const devManage = {
    label: '用户指纹管理',
    click() {
        if (win) {
            win.webContents.send('router', { path: '/main/user' });
            if (win.isVisible()) {
                win.focus();
                win.setSkipTaskbar(false);
            } else {
                win.show();
                win.setSkipTaskbar(false);
            }
        }
    }
};
const recoveryDev = {
    label: '恢复出厂设置',
    click() {
        funcRecoveryDev(winRecoveryDev);
    }
};

const logLogin = {
    label: '登录日志',
    click() {
        if (win) {
            win.webContents.send('router', { path: '/main/log' });
            if (win.isVisible()) {
                win.focus();
            } else {
                win.show();
                win.setSkipTaskbar(false);
            }
        }
    }
};
function createTray(win: any) {
    if (!tray || null == tray) {
        tray = new SystemTray();
    }
    tray.setMainWindow(win);
    tray.setTitle('指纹应用');

    let trayMenu;

    if (!userToken || userToken === '') {
        trayMenu = Menu.buildFromTemplate([unlogin, logout]);
        win.webContents.send('router', { path: '/login' });
    } else {
        const role = store.get('role');
        if (role) {
            setUser(parseInt(store.get('role'), 10), tray, win);
            win.webContents.send('router', { path: '/main' });
        } else {
            trayMenu = Menu.buildFromTemplate([unlogin, logout]);
            win.webContents.send('router', { path: '/login' });
        }
    }
    ipcMain.on('login', (e: any, val: any) => {
        win.webContents.send('router', { path: '/login', status: '1' });
    });
    ipcMain.on('user', (e: any, val: any) => {
        setUser(val, tray, win);
        win.webContents.send('router', { path: '/main' });
    });
    ipcMain.on('menu', (e: any, val: any) => {
        switch (val) {
            case 1: {
                funcRecoveryDev(winRecoveryDev);
                break;
            }
            case 2: {
                funcCancellation();
                break;
            }
            case 3: {
                autoUpdater.checkForUpdates().then((updateCheckResult: any) => {
                    store.set('sysVersion', app.getVersion());
                    store.set(
                        'newVersion',
                        updateCheckResult.versionInfo.version
                    );
                    funcVersionUpdate(winVersion);
                });

                break;
            }
        }
    });
    if (trayMenu) {
        tray.setContextMenu(trayMenu);
    }
}
function setUser(val: any, tray: any, win: any) {
    win.setSize(900, 600);
    const name = store.get('displayName');
    if (val === 1 && tray) {
        const trayMenu = Menu.buildFromTemplate([
            {
                label: `Hi,${name}`,
                enabled: true
            },
            devManage,
            logLogin,
            devDetail,
            recoveryDev,
            versionUpdate,
            cancellation,
            logout
        ]);
        tray.setContextMenu(trayMenu);
    }
    if (val === 2 && tray) {
        const trayMenu = Menu.buildFromTemplate([
            {
                label: `Hi,${name}`,
                enabled: true
            },
            devManage,
            logLogin,
            devDetail,
            versionUpdate,
            cancellation,
            logout
        ]);
        tray.setContextMenu(trayMenu);
    }
    if (val === 3 && tray) {
        const trayMenu = Menu.buildFromTemplate([
            {
                label: `Hi,${name}`,
                enabled: true
            },

            logLogin,
            devDetail,
            versionUpdate,
            cancellation,
            logout
        ]);
        tray.setContextMenu(trayMenu);
    }
}
function loadAppView(win: any) {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string).then(() => {
            // 创建托盘
            createTray(win);
        });
        if (!process.env.IS_TEST) {
            win.webContents.openDevTools();
        }
    } else {
        createProtocol('app');
        win.loadURL('app://./index.html').then(() => {
            // 创建托盘
            createTray(win);
        });
    }
}

const sendUpdateMessage = (message: any, data: any) => {
    log.silly('版本更新', message, data);
    // if (webContents) {
    //     webContents.send('message', {
    //         message,
    //         data
    //     });
    // }
};

const checkForUpdates = () => {
    autoUpdater.setFeedURL(feedUrl);

    autoUpdater.on('error', (message: any) => {
        sendUpdateMessage('error', message);
    });
    autoUpdater.on('checking-for-update', (message: any) => {
        sendUpdateMessage('checking-for-update', message);
    });
    autoUpdater.on('update-available', (info: any) => {
        // let count = 0;
        // timer = setInterval(() => {
        //     if (count % 2 === 0) {
        //         tray.setImage(path.join(__dirname, '/renderer/empty.ico'));
        //     } else {
        //         tray.setImage(path.join(__dirname, '/renderer/favicon.ico'));
        //     }
        //     count++;
        // }, 500);
        sendUpdateMessage('update-available', info);
    });
    autoUpdater.on('update-not-available', (message: any) => {
        sendUpdateMessage('update-not-available', message);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj: any) => {
        sendUpdateMessage('downloadProgress', progressObj);
    });
    autoUpdater.on(
        'update-downloaded',
        (
            event: any,
            releaseNotes: any,
            releaseName: any,
            releaseDate: any,
            updateUrl: any,
            quitAndUpdate: any
        ) => {
            ipcMain.on('updateVersion', (e, arg) => {
                log.info('updateVersion:', arg);
                appQuit = true;
                autoUpdater.quitAndInstall();
            });
            // sendUpdateMessage('isUpdateNow', '');
        }
    );

    // 执行自动更新检查
    autoUpdater.checkForUpdates().then((updateCheckResult: any) => {
        log.info('当地版本', app.getVersion());
        store.set('sysVersion', app.getVersion());
        store.set('newVersion', updateCheckResult.versionInfo.version);
    });
    timer = setInterval(() => {
        autoUpdater.checkForUpdates().then((updateCheckResult: any) => {
            log.info('当地版本', app.getVersion());
            store.set('sysVersion', app.getVersion());
            store.set('newVersion', updateCheckResult.versionInfo.version);
            if (winVersion) {
                winVersion.webContents.send('getVersion');
            }
            if (win) {
                win.webContents.send('getVersion');
            }
        });
    }, 1000 * 60 * 5);
    ipcMain.on('getVersion', () => {
        autoUpdater.checkForUpdates().then((updateCheckResult: any) => {
            store.set('sysVersion', app.getVersion());
            store.set('newVersion', updateCheckResult.versionInfo.version);
            if (winVersion) {
                winVersion.webContents.send('getVersion');
            }
            if (win) {
                win.webContents.send('getVersion');
            }
        });
    });
};
