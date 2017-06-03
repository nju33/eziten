'use strict'

import {app, BrowserWindow, screen, Tray, ipcMain,
        globalShortcut} from 'electron';
import darkMode from 'dark-mode';
import storage from 'electron-json-storage';

let mainWindow = null;
let mainTray = null;
let trayWindow = null;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  const {width} = screen.getPrimaryDisplay().workAreaSize;
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    y: 0,
    x: 0,
    height: 24 * 4,
    width,
    frame: false,
    resizable: false,
    movable: false,
    fullscreenable: false,
    alwaysOnTop: process.env.NODE_ENV === 'production'
  })

  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV === 'production') {
    mainWindow.on('blur', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      }
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  return mainWindow;
}

function createTray() {
  mainTray = new Tray(`${__dirname}/images/trayTemplate.png`);
  mainTray.setToolTip('Eziten');

  mainTray.on('click', () => {
    if (mainWindow === null) {
      createWindow();
    } else if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  });
}

app.on('ready', () => {
  createTray();
  createWindow().hide();
  app.dock.hide();

  globalShortcut.register('CommandOrControl+Alt+E', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+Alt+E');
})

ipcMain.on('get-mode:req', ({sender}) => {
  darkMode.isDark().then(bool => {
    sender.send('get-mode:res', {darkMode: bool})
  }).catch(err => console.log(err));
});

ipcMain.on('get-data:req', ({sender}) => {
  storage.get('config', (err, data) => {
    if (err !== null) {
      console.log(err);
    }

    if (!('histories' in data)) {
      data.histories = [];
    }
    sender.send('get-data:res', data);
  });
});

ipcMain.on('set-data:req', (ev, data) => {
  storage.set('config', data, err => {
    if (err !== null) {
      console.log(err);
    }
  })
});

ipcMain.on('hide', () => {
  if (mainWindow === null || !mainWindow.isVisible()) {
    return;
  }

  mainWindow.hide();
});
