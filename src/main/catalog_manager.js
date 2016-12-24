const log = require('electron-log')
const request = require('request')
const promise = require('promise')
const ms = require('ms')
const Catalog = require('../lib/catalog')
const {
  API_URL,
  CATALOG_FETCH_INTERVAL
} = require('../config')

const subscribers = []

const opts = {
  method: 'GET',
  baseUrl: API_URL,
  uri: '/v1/plugins/catalog',
  json: true
}

const CatalogManager = {
  addSubscribers: (window) => subscribers.push(window),

  enableAutoUpdate: () => setInterval(CatalogManager.fetch, ms(CATALOG_FETCH_INTERVAL)),

  notifySubscribers: (channel, args) => {
    if (subscribers.length) {
      for (const window of subscribers) {
        window.webContents.send(channel, args)
      }
    }
  },

  fetch: () =>
    new Promise((resolve, reject) => {
      log.info(`Fetching latest plugin catalog from ${API_URL}...`)

      CatalogManager.notifySubscribers('catalog/FETCH_REQUEST',{})

      request(opts, (error, response, body) => {
        if (error) return reject(error)

        CatalogManager.notifySubscribers('catalog/FETCH_RECEIVED',{})

        return resolve(body)
      })
    }),

  getSubscribers: () => subscribers

}

Object.freeze(CatalogManager)
module.exports = CatalogManager
