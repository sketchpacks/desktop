/* eslint strict: 0 */
'use strict';

const PRODUCTION = process.env.PRODUCTION;
const BUILD_DEV = process.env.BUILD_DEV;
const config = require('./app/config');

const path = require('path');
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
  if (process.env.BUILD_DEV) {
    console.log(`Sketchpacks v${config.APP_VERSION}`)
  }

  if (process.env.PRODUCTION) {
    console.log(`Checking for client updates...`)

    const updater = require('./app/main/updater')
    updater.init()
  }
})

menuBar.on('after-create-window', function () {
  menuBar.window.show()

  if (process.env.BUILD_DEV) {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})
