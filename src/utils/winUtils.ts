import { BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
export function funcRecoveryDev(winRecoveryDev: any) {
    if (winRecoveryDev && !winRecoveryDev.isDestroyed()) {
        if (!winRecoveryDev.isVisible()) {
            winRecoveryDev.show();
            winRecoveryDev.setSkipTaskbar(false);
        } else {
            winRecoveryDev.focus();
        }
    } else {
        winRecoveryDev = new BrowserWindow({
            width: 640,
            height: 350,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: true
            }
        });
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            winRecoveryDev
                .loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
                .then(() => {
                    winRecoveryDev.webContents.send('router', {
                        path: '/recovery'
                    });
                });
        } else {
            // win.webContents.openDevTools();
            createProtocol('app');
            // Load the index.html when not in development
            winRecoveryDev.loadURL('app://./index.html').then(() => {
                winRecoveryDev.webContents.send('router', {
                    path: '/recovery'
                });
            });
        }
    }
}
export function funcVersionUpdate(winVersion: any) {
    if (!winVersion || winVersion.isDestroyed()) {
        winVersion = new BrowserWindow({
            width: 640,
            height: 350,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: true
            }
        });

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            winVersion
                .loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
                .then(() => {
                    winVersion.webContents.send('router', {
                        path: '/version'
                    });
                });
        } else {
            // win.webContents.openDevTools();
            createProtocol('app');
            // Load the index.html when not in development
            winVersion.loadURL('app://./index.html').then(() => {
                winVersion.webContents.send('router', {
                    path: '/version'
                });
            });
        }
    } else {
        if (winVersion.isVisible()) {
            winVersion.focus();
        } else {
            winVersion.show();
            winVersion.setSkipTaskbar(false);
        }
    }
}
