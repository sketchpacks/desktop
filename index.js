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

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 640,
  height: 600,
  index: `file://${__dirname}/src/dist/index.html`,
  resizable: false
}

if (process.env.NODE_ENV === 'development') opts.index = 'http://localhost:8080/'

const menuBar = menubar(opts)

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${config.APP_VERSION} launched in ${process.env.NODE_ENV} mode`)
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
  if (process.env.NODE_ENV === 'production') {
    const updater = require('./src/main/updater')
    updater.init()
  }
})
