const { app, BrowserWindow, screen, Menu, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
let nhanVienWindow = null;
let mainWindow = null;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 500,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // contextIsolation: true,
      // enableRemoteModule: true,
      nodeIntegration: true,
    }
  });
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    if (nhanVienWindow) {
      nhanVienWindow.close();
    }
    mainWindow = null;
  });
}



app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// nhận sự kiện open-quanlynhanvien
ipcMain.on('open-quanly', (event) => {
  if (nhanVienWindow) {
    if (nhanVienWindow.isMinimized()) {
      nhanVienWindow.restore();
    } else {
      nhanVienWindow.focus();
    }
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    nhanVienWindow = new BrowserWindow({
      width: width,
      height: height,
      minWidth: 500,
      minHeight: 500,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    });

    nhanVienWindow.loadFile('./quanly/quanly.html');

    nhanVienWindow.on('closed', () => {
      nhanVienWindow = null;
    });
  }
});

ipcMain.on('open-focused-window', (event, screenID) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const focusedWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  focusedWindow.loadURL(`./screenFocus.html?screenID=${screenID}`);
});

