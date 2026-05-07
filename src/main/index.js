const { app, BrowserWindow, ipcMain, dialog, protocol, net: electronNet } = require('electron')
const path = require('path')
const fs = require('fs')
const { pathToFileURL } = require('url')
const { getFreePort, startStaticServer, stopStaticServer } = require('./staticServer')

// Register protocol before app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true } }
])

let runWindow = null

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
        
        filePath = path.normalize(filePath)

        console.log('[Media Protocol] URL:', request.url)
        console.log('[Media Protocol] Path:', filePath)

        if (!fs.existsSync(filePath)) {
            console.error('[Media Protocol] File NOT found:', filePath)
            return new Response('File Not Found', { status: 404 })
        }
        
        const fileUrl = pathToFileURL(filePath).toString()
        return electronNet.fetch(fileUrl)
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
  const itemsPath = path.resolve(projectDir, project.itemsFile || 'data/items.json')
  const npcsPath = path.resolve(projectDir, project.npcsFile || 'data/npcs.json')
  const tilesetsPath = path.resolve(projectDir, project.tilesetsFile || 'data/tilesets.json')
  const objectTypesPath = path.resolve(projectDir, project.objectTypesFile || 'data/objectTypes.json')
  const scenarioPath = path.resolve(projectDir, project.scenarioFile || 'data/scenario.json')

  const mobTypes = JSON.parse(fs.readFileSync(mobTypesPath, 'utf8'))
  const appearances = JSON.parse(fs.readFileSync(appearancesPath, 'utf8'))
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'))
  const npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'))
  const tilesets = fs.existsSync(tilesetsPath) ? JSON.parse(fs.readFileSync(tilesetsPath, 'utf8')) : []
  const objectTypes = fs.existsSync(objectTypesPath) ? JSON.parse(fs.readFileSync(objectTypesPath, 'utf8')) : []
  const scenario = fs.existsSync(scenarioPath) ? JSON.parse(fs.readFileSync(scenarioPath, 'utf8')) : null

  return {
    filePath,
    project,
    data: {
      mobTypes,
      appearances,
      items,
      npcs,
      tilesets,
      objectTypes,
      scenario
    }
  }
})

ipcMain.handle('save-data', async (event, { filePath, data }) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
})

ipcMain.handle('load-file', async (event, filePath) => {
    try {
        if (!fs.existsSync(filePath)) return null
        return fs.readFileSync(filePath, 'utf8')
    } catch (e) {
        console.error('[IPC] load-file error:', e)
        return null
    }
})

ipcMain.handle('run-project', async (event, projectDir) => {
    try {
        const tmpDir = path.join(app.getAppPath(), 'tmp')
        const runtimeSrc = path.join(app.getAppPath(), 'oax6-runtime')
        
        // Ensure tmp is fresh
        if (fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true })
        }
        fs.mkdirSync(tmpDir, { recursive: true })

        // 1. Copy runtime to tmp
        if (fs.existsSync(runtimeSrc)) {
            fs.cpSync(runtimeSrc, tmpDir, { recursive: true })
        }

        // 2. Copy data/* into tmp/scenario
        const dataSrc = path.join(projectDir, 'data')
        const dataDest = path.join(tmpDir, 'scenario')
        if (fs.existsSync(dataSrc)) {
            fs.mkdirSync(dataDest, { recursive: true })
            fs.cpSync(dataSrc, dataDest, { recursive: true })
        }

        // 3. Copy maps/* into tmp/scenario/maps
        const mapsSrc = path.join(projectDir, 'maps')
        const mapsDest = path.join(tmpDir, 'scenario', 'maps')
        if (fs.existsSync(mapsSrc)) {
            fs.mkdirSync(mapsDest, { recursive: true })
            fs.cpSync(mapsSrc, mapsDest, { recursive: true })
        }

        // 4. Copy res/* into tmp/assets
        const resSrc = path.join(projectDir, 'res')
        const resDest = path.join(tmpDir, 'assets')
        if (fs.existsSync(resSrc)) {
            fs.mkdirSync(resDest, { recursive: true })
            fs.cpSync(resSrc, resDest, { recursive: true })
        }

        // Start server on a free port
        const port = await getFreePort()
        await startStaticServer(tmpDir, port)

        if (runWindow) {
          runWindow.loadURL(`http://localhost:${port}`)
          runWindow.focus()
        } else {
          runWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            title: 'Arthurian - Running Project',
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true
            }
          })
          runWindow.loadURL(`http://localhost:${port}`)
          runWindow.on('closed', () => {
            runWindow = null
            stopStaticServer()
          })
        }

        return true
    } catch (e) {
        console.error('[IPC] run-project error:', e)
        throw e
    }
})

ipcMain.handle('list-files', async (event, dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) return []
        const files = fs.readdirSync(dirPath)
        return files.filter(file => fs.statSync(path.join(dirPath, file)).isFile())
    } catch (e) {
        console.error('[IPC] list-files error:', e)
        return []
    }
})
