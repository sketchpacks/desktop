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
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const protocol = electron.protocol
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
  alwaysOnTop: true,
  showOnAllWorkspaces: true,
  preloadWindow: true,
  tooltip: `Sketchpacks for macOS v${pkg.version}`,
  backgroundColor: '#f8f9fa',
}

const menuBar = menubar(opts)

let mainWindow

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${APP_VERSION} (${__PRODUCTION__ ? 'PROD' : 'DEV'}) launched`)

  if (__PRODUCTION__ && __ELECTRON__) {
    const server = require('./src/server')
    server.listen(SERVER_PORT)
    log.info("Server started on port " + SERVER_PORT)
  }
})

menuBar.on('after-show', () => {
  // if (__DEVELOPMENT__ || __DEBUG__) {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  // }
})

menuBar.on('after-create-window', () => {
  menuBar.window.hide()
  mainWindow = menuBar.window
})

app.on('ready', () => {
  if (__PRODUCTION__ && __ELECTRON__) {
    const updater = require('./src/main/updater')
    updater.init()

  }

  protocol.registerHttpProtocol('sketchpacks', (request, callback) => {
    const uri = url.parse(request.url)

    mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, uri)
  }, (error) => {
    if (error) console.error('Failed to register protocol', error)
  })
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
