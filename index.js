/* eslint strict: 0 */
'use strict';

const {
  APP_VERSION,
  SERVER_PORT,
  __PRODUCTION__,
  __DEVELOPMENT__,
  __ELECTRON__
} = require('./src/config')

const pkg = require('./package.json')
const path = require('path')
const os = require('os')
const ms = require('ms')
const _ = require('lodash')
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
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
} = require('./src/actions/plugin_manager')

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 720,
  height: 540,
  index: `http://localhost:${SERVER_PORT}/`,
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

  if (__PRODUCTION__ && __ELECTRON__) {
    const server = require('./src/server')
    server.listen(SERVER_PORT)
    log.info("Server started on port " + SERVER_PORT)
  }
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
      event.sender.send(INSTALL_PLUGIN_SUCCESS, plugin)
    })
})

ipcMain.on(UNINSTALL_PLUGIN_REQUEST, (event, arg) => {
  PluginManager.uninstall(event, arg)
    .then((plugin) => {
      event.sender.send(UNINSTALL_PLUGIN_SUCCESS, plugin)
    })
})

ipcMain.on('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', (event, arg) => {
  if (externalPluginInstallQueue.length > 0) {
    _.forEach(externalPluginInstallQueue, (pluginId) => {
      event.sender.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', pluginId)
    })
    externalPluginInstallQueue = null
  }
})



ipcMain.on('CHECK_FOR_CLIENT_UPDATES', (evt, arg) => {
  updater.checkForUpdates
})
