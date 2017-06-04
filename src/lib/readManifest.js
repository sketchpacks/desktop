const Promise = require('promise')
const json5file = require('@sketchpacks/json5file')
const log = require('electron-log')

const readManifest = (filepath) => new Promise((resolve,reject) => {
  // log.debug('readManifest')
  json5file.readFile(filepath, (err, contents) => {
    log.debug('Reading manifest at ', filepath)
    if (err) reject(err)

    try {
      const plugin = Object.assign(contents, {
        install_path: filepath.split('.sketchplugin/Contents')[0] + '.sketchplugin'
      })
      resolve(plugin)
    } catch (err) {
      console.log(err, contents)
      reject(err)
    }

  })
})

module.exports = readManifest
