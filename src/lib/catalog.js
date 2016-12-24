const Promise = require('promise')
const Database = require('nedb')
const { join } = require('path')
const { app } = require('electron')

const database = new Database({
  filename: join(app.getPath('userData'), 'catalog.db'),
  autoload: true
})

const Catalog = {
  getAllPlugins: () => new Promise((resolve, reject) => {
    database.find({}, (err, plugins) => {
      if (err) return reject(err)
      return resolve(plugins)
    })
  })

}

Object.freeze(Catalog)
module.exports = Catalog
