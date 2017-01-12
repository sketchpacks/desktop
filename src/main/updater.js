const electron = require('electron')
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const log = require('electron-log')
const os = require('os')
const ms = require('ms')
const config = require('../config')

let updateFeed = `${config.RELEASE_SERVER_URL}/update?version=${config.APP_VERSION}&platform=${os.platform()}`

let promptRestart = false

autoUpdater.setFeedURL(updateFeed)

const checkForUpdates = function checkForUpdates () {
  if (!promptRestart) {
    autoUpdater.checkForUpdates()
  }
}

const checkForUpdatesInterval = '10s'
const enableAutoUpdateCheck = function enableAutoUpdateCheck () {
  checkForUpdates()
  setInterval(checkForUpdates, ms(checkForUpdatesInterval))
}

function init () {
  enableAutoUpdateCheck()

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates')
  })

  autoUpdater.on('update-not-available', () => {
    log.info('No update available')
  })

  autoUpdater.on('update-available', () => {
    log.info('Update available')
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    promptRestart = true
    handleClientUpdate(releaseNotes, releaseName, releaseDate, updateURL)
    log.info('Update downloaded')
  })

  autoUpdater.on('error', (error) => {
    log.info('Failed to check for updates', error)
  })
}

function handleClientUpdate (releaseNotes, releaseName, releaseDate, updateURL) {
  const opts = {
    type: 'info',
    title: 'A new version of Sketchpacks is available',
    message: 'A new version of Sketchpacks is available',
    detail: `Sketchpacks for macOS v${releaseName} is now available — you have v${config.APP_VERSION}. Would you like to install this update now?`,
    buttons: ['Install now', 'Later'],
    defaultId: 0,
    cancelId: 1,
  }

  dialog.showMessageBox(opts, ((response) => {
    if (response === 0) {
      log.info('Restarting app to install updates')
      autoUpdater.quitAndInstall()
    }

    promptRestart = false
  }))
}

module.exports = {
  init,
  checkForUpdates
}
