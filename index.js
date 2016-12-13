/* eslint strict: 0 */
'use strict';

const config = require('./app/config');

const path = require('path');
const os = require('os')
const ms = require('ms')
const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const autoUpdater = electron.autoUpdater;
const log = require('electron-log');
const menubar = require('menubar');

const opts = {
  dir: __dirname,
  icon: __dirname + '/app/IconTemplate.png',
  width: 640,
  height: 600,
  index: `file://${__dirname}/app/dist/index.html`,
  resizable: false
}

const menuBar = menubar(opts)

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${config.APP_VERSION} launched in ${process.env.NODE_ENV} mode`)
})

menuBar.on('after-show', () => {
  if (process.env.NODE_ENV === 'development') {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})

menuBar.on('after-create-window', () => {
  menuBar.window.show()
})


app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    const updater = require('./app/main/updater')
    updater.init()
  }
})
