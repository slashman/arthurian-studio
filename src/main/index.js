const { app, BrowserWindow, ipcMain, dialog, protocol, net } = require('electron')
const path = require('path')
const fs = require('fs')
const { pathToFileURL } = require('url')

// Register protocol before app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true } }
])

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Use protocol.handle (Electron 25+)
  protocol.handle('media', (request) => {
    try {
        const url = new URL(request.url)
        // url.pathname will be /D:/path on Windows or /Users/path on Mac
        let filePath = decodeURIComponent(url.pathname)
        
        // On Windows, we need to strip the leading slash from /D:/...
        if (process.platform === 'win32' && filePath.startsWith('/') && /^\/[a-zA-Z]:/.test(filePath)) {
            filePath = filePath.slice(1)
        }

        console.log('[Media Protocol] URL:', request.url)
        console.log('[Media Protocol] Path:', filePath)

        if (!fs.existsSync(filePath)) {
            console.error('[Media Protocol] File NOT found:', filePath)
            return new Response('File Not Found', { status: 404 })
        }
        
        const fileUrl = pathToFileURL(filePath).toString()
        return net.fetch(fileUrl)
    } catch (e) {
        console.error('[Media Protocol] Error:', e)
        return new Response('Internal Error', { status: 500 })
    }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-project', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Arthurian Project', extensions: ['arthurian'] }],
    properties: ['openFile']
  })

  if (canceled || filePaths.length === 0) return null

  const filePath = filePaths[0]
  const projectDir = path.dirname(filePath)
  const content = fs.readFileSync(filePath, 'utf8')
  
  let project;
  try {
      project = JSON.parse(content)
  } catch (e) {
      const fixedContent = content
        .replace(/"appearancesFile: /g, '"appearancesFile": ')
        .replace(/"mobTypesFile: /g, '"mobTypesFile": ')
      project = JSON.parse(fixedContent)
  }

  const mobTypesPath = path.resolve(projectDir, project.mobTypesFile)
  const appearancesPath = path.resolve(projectDir, project.appearancesFile)

  const mobTypes = JSON.parse(fs.readFileSync(mobTypesPath, 'utf8'))
  const appearances = JSON.parse(fs.readFileSync(appearancesPath, 'utf8'))

  return {
    filePath,
    project,
    data: {
      mobTypes,
      appearances
    }
  }
})

ipcMain.handle('save-data', async (event, { filePath, data }) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
})
