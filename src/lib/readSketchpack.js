const Promise = require('promise')
const jsonfile = require('jsonfile')
const log = require('electron-log')

const readSketchpack = (filepath) => new Promise((resolve,reject) => {
  jsonfile.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    try {
      let plugins = Object.keys(contents.plugins).map(p => contents.plugins[p])
      resolve(plugins)
    } catch (err) {
      reject(err)
    }

  })
})

module.exports = readSketchpack
