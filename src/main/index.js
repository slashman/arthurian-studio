const { app, BrowserWindow, ipcMain, dialog, protocol, net: electronNet } = require('electron')
const path = require('path')
const fs = require('fs')
const { pathToFileURL } = require('url')
const { getFreePort, startStaticServer, stopStaticServer } = require('./staticServer')
const { createMenu } = require('./menu')

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

  createMenu(win)
}

app.whenReady().then(() => {
  // Use protocol.handle (Electron 25+)
  protocol.handle('media', (request) => {
    try {
        const url = new URL(request.url)
        let filePath = decodeURIComponent(url.pathname)
        if (process.platform === 'win32') {
            // Windows: pathname is /D:/path — strip leading slash
            if (/^\/[a-zA-Z]:/.test(filePath)) {
                filePath = filePath.slice(1)
            }
        } else {
            // macOS/Linux: hostname holds the first path segment
            // e.g. media://Users/slashie/... → hostname="Users", pathname="/slashie/..."
            const hostname = decodeURIComponent(url.hostname)
            if (hostname) {
                filePath = '/' + hostname + filePath
            }
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

ipcMain.handle('get-templates', async () => {
    try {
        const templatesPath = path.join(app.getAppPath(), 'templates', 'templates.json')
        if (!fs.existsSync(templatesPath)) return { templates: [] }
        return JSON.parse(fs.readFileSync(templatesPath, 'utf8'))
    } catch (e) {
        console.error('[IPC] get-templates error:', e)
        return { templates: [] }
    }
})

ipcMain.handle('get-runtimes', async () => {
    try {
        const runtimesPath = path.join(app.getAppPath(), 'runtimes', 'runtimes.json')
        if (!fs.existsSync(runtimesPath)) return { runtimes: [] }
        return JSON.parse(fs.readFileSync(runtimesPath, 'utf8'))
    } catch (e) {
        console.error('[IPC] get-runtimes error:', e)
        return { runtimes: [] }
    }
})

ipcMain.handle('create-project', async (event, { name, templateDir, runtimeCode }) => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory'],
            title: 'Select Project Directory'
        })

        if (canceled || filePaths.length === 0) return null

        const projectDir = filePaths[0]
        const templatesJsonPath = path.join(app.getAppPath(), 'templates', 'templates.json')
        const templatesData = JSON.parse(fs.readFileSync(templatesJsonPath, 'utf8'))
        const template = templatesData.templates.find(t => t.directory === templateDir)
        
        const runtimesJsonPath = path.join(app.getAppPath(), 'runtimes', 'runtimes.json')
        const runtimesData = JSON.parse(fs.readFileSync(runtimesJsonPath, 'utf8'))
        const runtime = runtimesData.runtimes.find(r => r.code === runtimeCode)

        const templatePath = path.join(app.getAppPath(), 'templates', templateDir)
        if (!fs.existsSync(templatePath)) throw new Error(`Template not found: ${templateDir}`)

        // Copy template contents
        fs.cpSync(templatePath, projectDir, { recursive: true })

        // Update and rename project.arthurian
        const oldProjPath = path.join(projectDir, 'project.arthurian')
        const newProjPath = path.join(projectDir, `${name}.arthurian`)
        
        if (fs.existsSync(oldProjPath)) {
            const projectData = JSON.parse(fs.readFileSync(oldProjPath, 'utf8'))
            projectData.projectName = name
            if (template) {
                projectData.templateCode = template.code
                projectData.templateVersion = template.version
            }
            if (runtime) {
                projectData.runtimeCode = runtime.code
            }
            fs.writeFileSync(oldProjPath, JSON.stringify(projectData, null, 2), 'utf8')
            fs.renameSync(oldProjPath, newProjPath)
        }

        // Return path for immediate opening
        return newProjPath
    } catch (e) {
        console.error('[IPC] create-project error:', e)
        throw e
    }
})

ipcMain.handle('open-project', async (event, externalPath) => {
  let filePath = externalPath;
  if (!filePath) {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [{ name: 'Arthurian Project', extensions: ['arthurian'] }],
        properties: ['openFile']
      })
      if (canceled || filePaths.length === 0) return null
      filePath = filePaths[0]
  }

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

ipcMain.handle('run-project', async (event, projectDir, runtimeCode) => {
    try {
        const runtimesJsonPath = path.join(app.getAppPath(), 'runtimes', 'runtimes.json')
        const runtimesData = JSON.parse(fs.readFileSync(runtimesJsonPath, 'utf8'))
        const runtime = runtimesData.runtimes.find(r => r.code === runtimeCode)
        const runtimeDir = runtime ? runtime.directory : 'oax6-nightly'

        const tmpDir = path.join(app.getAppPath(), 'tmp')
        const runtimeSrc = path.join(app.getAppPath(), 'runtimes', runtimeDir)
        
        // Ensure tmp is fresh
        if (fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true })
        }
        fs.mkdirSync(tmpDir, { recursive: true })

        // 1. Copy runtime to tmp
        if (fs.existsSync(runtimeSrc)) {
            fs.cpSync(runtimeSrc, tmpDir, { recursive: true })
        } else {
            console.warn(`[IPC] Runtime not found at ${runtimeSrc}, falling back to default oax6-nightly`)
            const defaultRuntimeSrc = path.join(app.getAppPath(), 'runtimes', 'oax6-nightly')
            if (fs.existsSync(defaultRuntimeSrc)) {
                fs.cpSync(defaultRuntimeSrc, tmpDir, { recursive: true })
            }
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
