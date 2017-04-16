const Promise = require('promise')
const jsonfile = require('jsonfile')
const log = require('electron-log')

const readSketchpack = (filepath) => new Promise((resolve,reject) => {
  jsonfile.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    resolve(contents)
  })
})

module.exports = readSketchpack
