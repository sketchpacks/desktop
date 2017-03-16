/* eslint strict: 0 */
'use strict';

const {
  API_URL,
  APP_VERSION,
  SERVER_PORT,
  SKETCH_TOOLBOX_DB_PATH,
  __PRODUCTION__,
  __DEVELOPMENT__,
  __ELECTRON__
} = require('./src/config')

const pkg = require('./package.json')
const path = require('path')
const os = require('os')
const ms = require('ms')
const {forEach} = require('lodash')
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const protocol = electron.protocol
const url = require('url')
const querystring = require('querystring')
const {ipcMain, ipcRenderer} = electron
const log = require('electron-log')
const menubar = require('menubar')
const Database = require('nedb')
const dblite = require('dblite')
const axios = require('axios')
const async = require('async')

const PluginManager = require('./src/main/plugin_manager')
const Catalog = require('./src/lib/catalog')
const {
  CATALOG_FETCH_DELAY,
  CATALOG_FETCH_INTERVAL
} = require('./src/config')

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
  tooltip: `Sketchpacks v${pkg.version}`,
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

ipcMain.on(INSTALL_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.install(event, arg)
    .then((plugin) => {
      mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, plugin)
    })
})

ipcMain.on(UPDATE_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.install(event, arg)
    .then((plugin) => {
      mainWindow.webContents.send(UPDATE_PLUGIN_SUCCESS, plugin)
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
      reject({})
    })
})

const installQueue = (plugins) => new Promise((resolve, reject) => {
  async.series(plugins.map(plugin => (callback) => {
      PluginManager.install(null, plugin)
        .then((result) => {
          mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, result)
          callback(null, result)
        })
    }), (error, results) => console.log(results))
})

ipcMain.on('IMPORT_FROM_SKETCH_TOOLBOX', (event, args) => {
  const homepath = os.homedir()
  const db = dblite(path.join(homepath, SKETCH_TOOLBOX_DB_PATH))

  db.query('SELECT ZDIRECTORYNAME,ZNAME,ZOWNER FROM ZPLUGIN WHERE ZSTATE = 1', {directory_name: String, slug: String, owner: String}, (rows) => {
    Promise.all(rows.map(row => pluginData(row.owner,row.slug)))
      .then(data => {
        installQueue(data)
        db.close()
      })
  })

})
