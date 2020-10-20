import { shell, ipcRenderer, remote } from 'electron';

class WindowDecorated {
    public isMax: boolean = false;

    constructor() {
        this.init();
    }

    public init() {
        const own = this;
        ipcRenderer.on('windowMaximize', () => {
            own.isMax = true;
        });

        ipcRenderer.on('windowUnmaximize', () => {
            own.isMax = false;
        });

        ipcRenderer.on('windowMinimize', () => {
            own.isMax = false;
        });
    }

    public openURL(url: string) {
        shell.openExternal(url);
    }

    public flashFrame() {
        ipcRenderer.send('flashFrame');
    }

    // public min() {
    //     ipcRenderer.send('windowMin');
    // }
    //
    // public max() {
    //     ipcRenderer.send('windowMax');
    // }
    //
    // public restore() {
    //     ipcRenderer.send('windowRestore');
    // }
    //
    // public close() {
    //     ipcRenderer.send('windowClose');
    // }

    public flashIcon() {
        ipcRenderer.send('flashIcon');
    }

    public clearFlashIcon() {
        ipcRenderer.send('clearFlashIcon');
    }

    public max() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.maximize();
    }

    public min() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.minimize();
    }

    public restore() {
        const currentWindow = remote.getCurrentWindow();
        console.log(currentWindow.isMaximized());
        currentWindow.unmaximize();
    }

    public close() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.close();
    }

    public bringFront(isOnTop: boolean) {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.setAlwaysOnTop(isOnTop);
    }

    public focus() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.focus();
    }

    public isFocused() {
        const currentWindow = remote.getCurrentWindow();
        return currentWindow.isFocused();
    }

    public showInactive() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.showInactive();
    }

    public hide() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.hide();
    }

    public show() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.show();
    }
}

export default new WindowDecorated();
