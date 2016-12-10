const electron = require('electron')
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const os = require('os')
const ms = require('ms')
const config = require('../config')

let updateFeed = `${config.RELEASE_SERVER_URL}/update?version=${config.APP_VERSION}&platform=${os.platform()}`
autoUpdater.setFeedURL(updateFeed)

const checkForUpdates = function checkForUpdates () {
  autoUpdater.checkForUpdates()
}

let checkForUpdatesInterval
const enableAutoUpdateCheck = function enableAutoUpdateCheck () {
  checkForUpdates()
  checkForUpdatesInterval = setInterval(checkForUpdates, ms('10s'))
}

function init () {
  enableAutoUpdateCheck()

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates')
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No update available')
  })

  autoUpdater.on('update-available', () => {
    console.log('Update available')
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    handleClientUpdate(releaseNotes, releaseName, releaseDate, updateURL)
  })

  autoUpdater.on('error', (error) => {
    console.log('Failed to check for updates', error)
  })
}

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

module.exports = {
  init,
  checkForUpdates
}
