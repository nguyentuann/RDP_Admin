const { contextBridge, ipcRenderer } = require('electron');



// Expose các phương thức cần thiết cho renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendOpenQuanLy: () => ipcRenderer.send('open-quanly'),
  openNewWindowWithStream: (stream) => ipcRenderer.send('open-new-window-with-stream', stream),
  onSetStream: (callback) => ipcRenderer.on('set-stream', callback), 
  cacheStream: (stream) => ipcRenderer.send('cache-stream', stream)
});

