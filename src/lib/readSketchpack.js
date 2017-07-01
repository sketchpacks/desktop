const Promise = require('promise')
const json5file = require('@sketchpacks/json5file')
const log = require('electron-log')

const initialState = {
  isLocked: false,
  isImporting: false,
  isLoaded: false,
  name: "My Library",
  plugins: {
    allIdentifiers: [],
    byIdentifier: {}
  }
}

const readSketchpack = (filepath) => new Promise((resolve,reject) => {
  const data = Object.assign({},
    initialState,
    contents
  )

  try {
    json5file.readFile(filepath, (err, contents) => {
      if (err) {
        log.info(err, data)
        resolve(data)
      }

      log.info('readSketchpack',data)
      resolve(data)
    })
  } catch (err) {
    log.info(err, data)
    resolve(data)
  }
})

module.exports = readSketchpack
