const { contextBridge, ipcRenderer } = require('electron');



// Expose các phương thức cần thiết cho renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendOpenQuanLy: () => ipcRenderer.send('open-quanly'),
  openFocusedWindow: (screenID) => ipcRenderer.send('open-focused-window', screenID)
});



