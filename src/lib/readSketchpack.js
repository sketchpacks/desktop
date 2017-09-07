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
  json5file.readFile(filepath, (err, contents) => {
    if (err) {
      if (err.code === 'ENOENT') {
        log.debug('my-library.sketchpack does not exist', err)
      }

      reject(err)
    }

    const data = Object.assign({},
      initialState,
      contents
    )

    log.debug('Parsing default my-library.sketchpack', data)

    resolve(data)
  })
})

module.exports = readSketchpack
