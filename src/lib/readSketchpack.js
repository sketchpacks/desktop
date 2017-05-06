const Promise = require('promise')
const json5file = require('@sketchpacks/json5file')
const log = require('electron-log')

const readSketchpack = (filepath) => new Promise((resolve,reject) => {
  json5file.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    resolve(contents)
  })
})

module.exports = readSketchpack
