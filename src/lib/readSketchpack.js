const Promise = require('promise')
const jsonfile = require('jsonfile')

const readSketchpack = (filepath) => new Promise((resolve,reject) => {
  jsonfile.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    const plugins = Object.keys(contents.plugins).map(p => contents.plugins[p])

    resolve(plugins)
  })
})

module.exports = readSketchpack
