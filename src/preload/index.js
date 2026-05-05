const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openProject: () => ipcRenderer.invoke('open-project'),
  saveData: (filePath, data) => ipcRenderer.invoke('save-data', { filePath, data }),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
  runProject: (projectDir) => ipcRenderer.invoke('run-project', projectDir)
})
