/* eslint strict: 0 */
'use strict';

const PRODUCTION = process.env.PRODUCTION;
const BUILD_DEV = process.env.BUILD_DEV;
const config = require('./app/config');

const path = require('path');
const os = require('os')
const ms = require('ms')
const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const autoUpdater = electron.autoUpdater;
const menubar = require('menubar');

let menuBar
let updateFeed = `${config.RELEASE_SERVER_URL}/update?version=${config.APP_VERSION}&platform=${os.platform()}&channel=alpha`

const opts = {
  dir: __dirname,
  icon: __dirname + '/app/IconTemplate.png',
  width: 640,
  height: 600,
  index: `file://${__dirname}/app/index-electron.html`,
  resizable: false
}

menuBar = menubar(opts)

menuBar.on('ready', function () {
  if (process.env.BUILD_DEV) {
    console.log(`Sketchpacks v${config.APP_VERSION}`)
  }
})

menuBar.on('after-show', function () {
  if (process.env.BUILD_DEV) {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})

menuBar.on('after-create-window', function () {
  menuBar.window.show()
})

app.on('ready', () => {
  autoUpdater.setFeedURL(updateFeed)
  autoUpdater.checkForUpdates()
})


// AutoUpdater Event Listeners

autoUpdater.on('checking-for-update', () => {
  if (process.env.BUILD_DEV) {
    console.log(`Checking for client updates - ${updateFeed}`)
  }
})

autoUpdater.on('update-not-available', () => {
  if (process.env.BUILD_DEV) {
    console.log(`No client updates available`)
  }
})

autoUpdater.on('update-available', () => {
  if (process.env.BUILD_DEV) {
    console.log(`Client update available`)
  }
})

autoUpdater.on('error', (error) => {
  if (process.env.BUILD_DEV) {
    console.log(`Failed to check for client updates`)
  }
})

function handleClientUpdate (releaseNotes, releaseName, releaseDate, updateURL) {
  const opts = {
    type: 'info',
    title: 'Sketchpacks',
    message: 'A new version has been downloaded. Please restart the application to apply the updates.',
    detail: releaseName + "\n\n" + releaseNotes,
    buttons: ['Restart', 'Later'],
    defaultId: 0,
    cancelId: 1
  }

  dialog.showMessageBox(opts, ((response) => {
    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  }))
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
  if (process.env.BUILD_DEV) {
    console.log(`New version of Sketchpacks has been downloaded`)
  }
  handleClientUpdate(releaseNotes, releaseName, releaseDate, updateURL)
})
