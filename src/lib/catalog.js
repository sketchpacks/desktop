const config = require('../config')
const Promise = require('promise')

let database

const Catalog = {
  getAllPlugins: () => new Promise((resolve, reject) => {
    if (database === undefined) return new Error("Set a database to query")

    database.find({}, (err, plugins) => {
      if (err) return reject(err)
      return resolve(plugins)
    })
  }),

  setDatabase: (db) => database = db,

  getDatabase: () => database
}

Object.freeze(Catalog)
module.exports = Catalog
