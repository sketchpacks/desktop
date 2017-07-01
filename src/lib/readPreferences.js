const path = require('path')
const Promise = require('promise')
const json5file = require('@sketchpacks/json5file')
const log = require('electron-log')
const { getInstallPath } = require('../lib/utils')

const electron = require('electron')

const defaultSketchpack = path.join(
  (electron.app || electron.remote.app).getPath('userData'),
  'my-library.sketchpack'
)

const initialState = {
  sketchpack: {
    location: defaultSketchpack,
    defaultLock: 'locked'
  },
  syncing: {
    enabled: false,
    overwatch: false
  },
  plugins: {
    install_directory: getInstallPath()
  }
}

const readPreferences = (filepath) => new Promise((resolve,reject) => {
  try {
    json5file.readFile(filepath, (err, contents) => {
      const data = Object.assign({},
        initialState,
        contents
      )

      if (err) {
        log.info(err, data)
        resolve(data)
      }

      log.info('readPreferences',data)
      resolve(data)
    })
  } catch (err) {
    log.info(err, data)
    resolve(data)
  }

})

module.exports = readPreferences
