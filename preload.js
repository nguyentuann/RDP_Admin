const { contextBridge, ipcRenderer } = require('electron');
// const io = require('socket.io-client');

// const socket = io('http://localhost:3000');

// Expose các phương thức cần thiết cho renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendOpenQuanLy: () => ipcRenderer.send('open-quanly'),
  // socketEmit: (event, data) => socket.emit(event, data),
  // socketOn: (event, callback) => socket.on(event, callback),
});
