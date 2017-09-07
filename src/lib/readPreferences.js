const path = require('path')
const Promise = require('promise')
const json5file = require('@sketchpacks/json5file')
const log = require('electron-log')
const { getInstallPath } = require('./utils')

const electron = require('electron')

const defaultSketchpack = path.join(
  (electron.app || electron.remote.app).getPath('userData'),
  'my-library.sketchpack'
)

const initialState = {
  sketchpack: {
    location: defaultSketchpack,
    defaultLock: 'unlocked'
  },
  syncing: {
    enabled: false,
    overwatch: false
  },
  plugins: {
    install_directory: '/Library/Application Support/com.bohemiancoding.sketch3/Plugins'
  }
}

const readPreferences = (filepath) => new Promise((resolve,reject) => {
  json5file.readFile(filepath, (err, contents) => {
    if (err) {
      if (err.code === 'ENOENT') {
        log.debug('preferences.json does not exist', err)
      }

      reject(err)
    }

    const data = Object.assign({},
      initialState,
      contents
    )

    log.debug('Parsing default preferences.json', data)

    resolve(data)
  })
})


module.exports = readPreferences
