const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } = require('electron');
const { readFileSync } = require('fs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let isQuitting = false;
let externalYTJS = readFileSync(path.join(__dirname, 'yt-userscript.js')).toString();

// Helper function
function menuAddTools(menu, win) {
  menu.append(new MenuItem({
    label: "[F11] DevTools",
    accelerator: "F11",
    click: ()=>{
      if (!win.webContents.isDevToolsOpened()) {
        win.webContents.openDevTools();
      } else {
        win.webContents.closeDevTools();
      }
    }
  }));
}

const createBrowseWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    x: 200,
    y: 0,
    minimizable: false,
    maximizable: false,
    closable: false
  });

  win.loadFile(path.join(__dirname, 'browse.html'));
  
  // Listener for events that currently originate only from menu.js
  // Has to be on main process because the window contents get entirely changed
  const bwGoToListener = (e,msg)=>{
    win.loadURL(msg, {userAgent: 'Mozilla/5.0 (iPod; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/86.0.4240.77 Mobile/15E148 Safari/604.1'});
  }

  ipcMain.on("bw-goto", bwGoToListener);
  
  // YouTube Privacy likes to close the window after submit
  // The window will just get recreated right afterwards
  win.on("closed",(e)=>{
    ipcMain.removeListener("bw-goto", bwGoToListener);
    if (!isQuitting) {
      createBrowseWindow();
    }
  })
  
  // Menu management
  const menu = new Menu();
  menuAddTools(menu,win);
  win.setMenu(menu);
  win.setAutoHideMenuBar(true);

  // User-script loading
  win.webContents.on("dom-ready",()=>{
      win.webContents.executeJavaScript(externalYTJS).catch(err => {});
      // the external user-script errors are ignored because
      // the script seems to work just fine and there is no
      // point in scaring the user away with console error spam
  })
};

const createMenuWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 200,
    height: 600,
    x: 0,
    y: 0,
    minimizable: false,
    maximizable: false,
    webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, 'menu.html'));
  
  // Menu management
  const menu = new Menu();
  menuAddTools(menu,win);
  win.setMenu(menu);
  win.setAutoHideMenuBar(true);

  win.on("closed",()=>{
    app.quit();
  })
};

const initialize = () => {
  createBrowseWindow();
  createMenuWindow();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialize);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on("before-quit", ()=>{
  isQuitting = true;
  app.exit();
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
