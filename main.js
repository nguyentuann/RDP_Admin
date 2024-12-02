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


let streamCache = null; // Biến toàn cục để lưu trữ stream

ipcMain.on('open-new-window-with-stream', (event) => {
  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
    },
  });
  
  newWindow.loadFile('screenFocus.html'); // Giao diện của cửa sổ mới

  // Gửi thông báo khi cửa sổ đã sẵn sàng
  newWindow.webContents.once('dom-ready', () => {
    if (streamCache) {
      newWindow.webContents.send('set-stream', streamCache);
    }
  });
});

// Nhận stream từ renderer process và lưu lại
ipcMain.on('cache-stream', (event, stream) => {
  if (stream) {
    streamCache = stream;  // Lưu stream hợp lệ vào cache
  } else {
    console.error('Received invalid MediaStream');
  }
});