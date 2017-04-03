const Promise = require('promise')
const jsonfile = require('jsonfile')

const readLibrary = (filepath) => new Promise((resolve,reject) => {
  jsonfile.readFile(filepath, (err, contents) => {
    if (err) reject(err)

    resolve(contents.plugins)
  })
})

module.exports = readLibrary
