const config = require('../config')
const Promise = require('promise')
const _ = require('lodash')

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

  getDatabase: () => database,

  upsert: (plugins) => {
    const filteredPlugins = _.without(JSON.parse(plugins), null, undefined)

    new Promise((resolve, reject) => {
      let error
      const updatedPlugins = []

      _(filteredPlugins).forEach((plugin) => {
        database.update({ id: plugin.id }, { $set: {
            name: plugin.name,
            description: plugin.description,
            author: plugin.author,
            owner: plugin.owner,
            source_url: plugin.source_url,
            score: plugin.score,
            download_url: plugin.download_url,
            thumbnail_url: plugin.thumbnail_url,
            compatible_version: plugin.compatible_version,
            version: plugin.version,
            update_url: plugin.update_url,
            published_at: plugin.created_at,
            updated_at: plugin.updated_at
          } }, { upsert: true }, (err, num) => {
          if (err) error = err
          updatedPlugins.push(plugin)
        })
      })

      if (error) return reject(err)
      return resolve(filteredPlugins)
    })
  }
}

Object.freeze(Catalog)
module.exports = Catalog
