import path from 'path';
import { app, protocol, ipcMain, Tray, Menu, BrowserWindow } from 'electron';
export default class SystemTray {
    private isDevelopment: boolean = process.env.NODE_ENV !== 'production';
    private readonly icon: string = '/tray/favicon.ico';
    private readonly basePath: string = path.join(__dirname, '/');
    private tray: Tray;
    private mainWindow: BrowserWindow | null = null;
    constructor(icon?: string) {
        if (icon) {
            this.icon = icon;
        }
        if (this.isDevelopment) {
            this.basePath = path.join(__dirname, '../public');
        }
        this.tray = new Tray(path.join(this.basePath, this.icon));

        this.initialize();
    }
    public setMainWindow(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    public setTitle(title: string) {
        this.tray.setTitle(title + '');
    }
    public setContextMenu(trayMenu: Menu) {
        this.tray.setContextMenu(trayMenu);
    }
    public destroy() {
        this.tray.destroy();
    }
    private initialize(): void {
        const own = this;
        // this.createContextMenu();
        this.tray.setToolTip('指纹登录器');
        this.tray.on('click', () => {
            if (own.mainWindow) {
                own.mainWindow.isVisible()
                    ? own.mainWindow.hide()
                    : own.mainWindow.show();
                own.mainWindow.isVisible()
                    ? own.mainWindow.setSkipTaskbar(false)
                    : own.mainWindow.setSkipTaskbar(true);
            }
        });
    }

    private setImage(iconPath: string) {
        this.tray.setImage(iconPath);
    }
}
