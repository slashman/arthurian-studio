const { Menu, app } = require('electron')

function createMenu(win) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            win.webContents.send('menu-action', 'new-project')
          }
        },
        {
          label: 'Load Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            win.webContents.send('menu-action', 'load-project')
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Project',
      submenu: [
        {
          label: 'Project Info',
          click: () => {
            win.webContents.send('menu-action', 'project-info')
          }
        },
        {
          label: 'Run Project',
          accelerator: 'F5',
          click: () => {
            win.webContents.send('menu-action', 'run-project')
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Quickstart',
          click: () => {
            win.webContents.send('menu-action', 'quickstart')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = { createMenu }
