const Promise = require('promise')
const jsonfile = require('jsonfile')
const log = require('electron-log')

const readManifest = (filepath) => new Promise((resolve,reject) => {
  // log.debug('readManifest')
  jsonfile.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    try {
      const plugin = Object.assign(contents, {
        install_path: filepath.split('.sketchplugin/Contents')[0] + '.sketchplugin'
      })
      resolve(plugin)
    } catch (err) {
      reject(err)
    }

  })
})

module.exports = readManifest
