/* eslint strict: 0 */
'use strict';

const {
  APP_VERSION,
  SERVER_PORT
} = require('./src/config')

const path = require('path')
const os = require('os')
const ms = require('ms')
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const log = require('electron-log')
const menubar = require('menubar')

const __PRODUCTION__ = (process.env.NODE_ENV === 'production') || true

if (__PRODUCTION__) {
  const server = require('./src/server')
}


const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 640,
  height: 600,
  index: `http://localhost:${SERVER_PORT}/`,
  resizable: false
}

const menuBar = menubar(opts)

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${APP_VERSION} launched`)

  if (__PRODUCTION__) {
    server.listen(SERVER_PORT)
    log.info("Server started on port " + SERVER_PORT)
  }
})

menuBar.on('after-show', () => {
  // if (process.env.NODE_ENV === 'development') {
    // require('devtron').install()
    // menuBar.window.openDevTools({ mode: 'detach' })
  // }
  menuBar.window.openDevTools({ mode: 'detach' })
})

menuBar.on('after-create-window', () => {
  menuBar.window.show()
})


app.on('ready', () => {
  if (process.env.NODE_ENV !== 'development') {
    const updater = require('./src/main/updater')
    updater.init()
  }
})
