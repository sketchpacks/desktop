/* eslint strict: 0 */
'use strict';

const {
  API_URL,
  APP_VERSION,
  SERVER_PORT,
  SKETCH_TOOLBOX_DB_PATH,
  CATALOG_FETCH_DELAY,
  CATALOG_FETCH_INTERVAL,
  __PRODUCTION__,
  __DEVELOPMENT__,
  __ELECTRON__
} = require('./src/config')

const pkg = require('./package.json')
const path = require('path')
const os = require('os')
const fs = require('fs')
const {forEach,filter} = require('lodash')
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const protocol = electron.protocol
const url = require('url')
const {ipcMain, ipcRenderer} = electron
const log = require('electron-log')
const menubar = require('menubar')
const dblite = require('dblite')
const axios = require('axios')
const async = require('async')

const firstRun = require('first-run')
const AutoLaunch = require('auto-launch')
const autolauncher = new AutoLaunch({
	name: 'Sketchpacks'
})

const {getInstallPath} = require('./src/lib/utils')
const writeSketchpack = require('./src/lib/writeSketchpack')
const readSketchpack = require('./src/lib/readSketchpack')
const PluginManager = require('./src/main/plugin_manager')

const {
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,
  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_ERROR,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR,
  TOGGLE_VERSION_LOCK_REQUEST,
  TOGGLE_VERSION_LOCK_SUCCESS,
  TOGGLE_VERSION_LOCK_ERROR
} = require('./src/actions/plugin_manager')

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 720,
  height: 540,
  index: (__PRODUCTION__ && __ELECTRON__) ? `file://${__dirname}/src/dist/index.html` : `http://localhost:${SERVER_PORT}/`,
  resizable: false,
  alwaysOnTop: false,
  showOnAllWorkspaces: true,
  preloadWindow: true,
  tooltip: `Sketchpacks v${pkg.version} beta`,
  backgroundColor: '#f8f9fa',
}

const menuBar = menubar(opts)

let mainWindow
let updater
let externalPluginInstallQueue = []

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${APP_VERSION} (${__PRODUCTION__ ? 'PROD' : 'DEV'}) launched`)
})

menuBar.on('after-show', () => {
  if (__DEVELOPMENT__) {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})

menuBar.on('after-create-window', () => {
  menuBar.window.hide()
  mainWindow = menuBar.window
})

menuBar.on('show', () => {
  let bounds = menuBar.tray.getBounds()
  menuBar.setOption('y', (bounds.y > 0) ? bounds.y * 2 : 0)
})

app.on('ready', () => {
  if (__PRODUCTION__ && __ELECTRON__) {
    updater = require('./src/main/updater')
    updater.init()
  }

  protocol.registerHttpProtocol('sketchpacks', (request, callback) => {
    const uri = url.parse(request.url)
  }, (error) => {
    if (error) console.error('Failed to register protocol', error)
  })
})

app.on('open-url', (event, resource) => {
  event.preventDefault() // Handle event ourselves

  const uri = url.parse(resource)
  const pluginId = uri.path.slice(1)

  if (!app.isReady()) {
    externalPluginInstallQueue.push(pluginId)
  }
  else {
    mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', pluginId)
  }
})

ipcMain.on('APP_WINDOW_OPEN', (event, arg) => {
  menuBar.showWindow(menuBar.tray.getBounds())
})


ipcMain.on(INSTALL_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.install(event, arg)
    // .then((plugin) => {
    //   mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, plugin)
    // })
})


ipcMain.on(UPDATE_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.install(event, arg.updatedPlugin)
    .then((newPlugin) => {
      PluginManager.uninstall(event, arg.outdatedPlugin)
        .then((oldPlugin) => {
          mainWindow.webContents.send(UPDATE_PLUGIN_SUCCESS, newPlugin)
        })
    })
})


ipcMain.on(UNINSTALL_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.uninstall(event, arg)
    .then((plugin) => {
      mainWindow.webContents.send(UNINSTALL_PLUGIN_SUCCESS, plugin)
    })
})


ipcMain.on(TOGGLE_VERSION_LOCK_REQUEST, (event, args) => {
  mainWindow.webContents.send(TOGGLE_VERSION_LOCK_REQUEST, args)
})


ipcMain.on('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', (event, arg) => {
  if (externalPluginInstallQueue.length > 0) {
    forEach(externalPluginInstallQueue, (pluginId) => {
      mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', pluginId)
    })
    externalPluginInstallQueue = null
  }
})


ipcMain.on('CHECK_FOR_CLIENT_UPDATES', (evt, arg) => {
  const { confirm } = arg
  updater.checkForUpdates(confirm)
})

const pluginData = (owner,slug) => new Promise((resolve,reject) => {
  axios.get(`${API_URL}/v1/users/${owner}/plugins/${slug.toLowerCase()}`)
    .then(response => {
      resolve(response.data)
    })
    .catch(response => {
      resolve({})
    })
})

const installQueue = (plugins) => {
  if (plugins.length === 0) return
  const queue = filter(plugins, (p) => Object.keys(p).length > 0)

  async.series(queue.map(plugin => (callback) => {
      PluginManager.install(null, plugin)
        .then((result) => {
          mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, result)
          callback(null, result)
        })
    }), (error, results) => console.log(results))
}

const uninstallQueue = (plugins) => {
  if (plugins.length === 0) return

  async.series(plugins.map(plugin => (callback) => {
    PluginManager.uninstall(null, Object.assign({}, {install_path: path.join(getInstallPath(),plugin.directory_name.replace(/ /g, '\\ ')) }))
    .then((result) => {
      callback(null, result)
    })
  }), (error, results) => console.log(results))
}

const importFromSketchToolbox = (dbPath) => {
  const db = dblite(dbPath)

  mainWindow.webContents.send('IMPORT_START')
  db.query('SELECT ZDIRECTORYNAME,ZNAME,ZOWNER FROM ZPLUGIN WHERE ZSTATE = 1', {directory_name: String, slug: String, owner: String}, (rows) => {
    if (rows.length === 0) return

    Promise.all(rows.map(row => pluginData(row.owner,row.slug)))
      .then(data => {
        const importables = _.filter(rows, row => {
          return _.find(data, d => {
          	return d.name === row.name && d.owner.handle === row.owner
          })
        })

        installQueue(importables)
        uninstallQueue(importables)

        db.close()
      })
  })
}


ipcMain.on('IMPORT_FROM_SKETCH_TOOLBOX', (event, args) => {
  const homepath = os.homedir()
  const dbPath = path.join(homepath, SKETCH_TOOLBOX_DB_PATH)

  if (fs.existsSync(dbPath)) {
    dialog.showMessageBox(null, {
      buttons: ['Cancel', 'Import plugins'],
      defaultId: 1,
      cancelId: 0,
      message: '🚚 Import from Sketch Toolbox',
      detail: 'Import installed plugins from Sketch Toolbox. Plugins not found in the Sketchpacks Registry will be excluded.',
    }, (response, checkboxChecked) => {
      if (response) importFromSketchToolbox(dbPath)
    })
  }
  else {
    dialog.showMessageBox(null, {
      buttons: ['Ok'],
      defaultId: 0,
      cancelId: 0,
      message: '🤔 Import Failed',
      detail: 'We had trouble finding the location of Sketch Toolbox. No plugins were imported.',
    }, (response, checkboxChecked) => {})
  }
})


ipcMain.on('IMPORT_FROM_SKETCHPACK', (event, args) => {
  dialog.showOpenDialog(null, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Sketchpack',
        extensions: ['sketchpack']
      }
    ]
  }, (filePaths) => {
    if (filePaths) {
      try {
        readSketchpack(filePaths[0])
        .then(plugins => {
          Promise.all(plugins.map(plugin => pluginData(plugin.owner,plugin.name)))
          .then(data => {
            installQueue(data)
          })
        })
      } catch (err) {
        log.error(err)
      }

    }

  })
})


ipcMain.on('EXPORT_LIBRARY', (event, libraryContents) => {
  try {
    dialog.showSaveDialog(null, {
      nameFieldLabel: 'my-library',
      extensions: ['sketchpack'],
      defaultPath: path.join(app.getPath('desktop'),'my-library.sketchpack'),
      message: 'Export My Library',
      buttonLabel: 'Export',
      tags: false,
      title: 'Export My Library'
    }, (filepath) => {
      if (libraryContents.length === 0) return

      log.info(`My Library exported to ${filepath}`)

      if (filepath) writeSketchpack(filepath,libraryContents)
    })
  } catch (err) {
    log.error(err)
  }
})

process.on('uncaughtException', (err) => {
  log.error(err)
})


if (firstRun({name: pkg.name})) {
  autolauncher.enable()
}
