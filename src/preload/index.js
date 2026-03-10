const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openProject: () => ipcRenderer.invoke('open-project'),
  saveData: (filePath, data) => ipcRenderer.invoke('save-data', { filePath, data })
})
