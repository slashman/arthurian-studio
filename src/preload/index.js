const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openProject: (filePath) => ipcRenderer.invoke('open-project', filePath),
  saveData: (filePath, data) => ipcRenderer.invoke('save-data', { filePath, data }),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
  runProject: (projectDir, runtimeCode) => ipcRenderer.invoke('run-project', projectDir, runtimeCode),
  getTemplates: () => ipcRenderer.invoke('get-templates'),
  getRuntimes: () => ipcRenderer.invoke('get-runtimes'),
  createProject: (name, templateDir, runtimeCode) => ipcRenderer.invoke('create-project', { name, templateDir, runtimeCode }),
  onMenuAction: (callback) => {
    const listener = (event, action) => callback(action)
    ipcRenderer.on('menu-action', listener)
    return () => ipcRenderer.removeListener('menu-action', listener)
  }
})
