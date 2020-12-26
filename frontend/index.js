const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: true,
        devTools: true
    })
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(join(__dirname + '/index.html'));
}

app.once("ready", createWindow);