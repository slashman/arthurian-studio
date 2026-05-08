const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openProject: (filePath) => ipcRenderer.invoke('open-project', filePath),
  saveData: (filePath, data) => ipcRenderer.invoke('save-data', { filePath, data }),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
  runProject: (projectDir) => ipcRenderer.invoke('run-project', projectDir),
  getTemplates: () => ipcRenderer.invoke('get-templates'),
  createProject: (name, templateDir) => ipcRenderer.invoke('create-project', { name, templateDir }),
  onMenuAction: (callback) => {
    const listener = (event, action) => callback(action)
    ipcRenderer.on('menu-action', listener)
    return () => ipcRenderer.removeListener('menu-action', listener)
  }
})
