/* eslint strict: 0 */
'use strict';

const config = require('./src/config')

const path = require('path')
const os = require('os')
const ms = require('ms')
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const log = require('electron-log')
const menubar = require('menubar')

const server = require('./src/server')

const port = process.env.PORT || 3000

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 640,
  height: 600,
  index: `http://localhost:${port}/`,
  resizable: false
}

const menuBar = menubar(opts)

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${config.APP_VERSION} launched`)
  server.listen(port)
  log.info("Server started on port " + port)
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
