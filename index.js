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
  index: `file://${__dirname}/app/index-electron.html`,
  resizable: false
}

const menuBar = menubar(opts)

menuBar.on('ready', function () {
  log.info(`Sketchpacks v${config.APP_VERSION} ready to go`)
})

menuBar.on('after-show', function () {
  if (process.env.NODE_ENV == 'development') {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})

menuBar.on('after-create-window', function () {
  menuBar.window.show()
})


app.on('ready', () => {
  const updater = require('./app/main/updater')
  updater.init()
})
