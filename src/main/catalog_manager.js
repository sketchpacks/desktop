const log = require('electron-log')
const request = require('request')
const ms = require('ms')
const {
  API_URL,
  CATALOG_FETCH_INTERVAL
} = require('../config')

let instance = null

module.exports = class CatalogManager {
  constructor (store) {
    if (!instance) {
      instance = this
    }

    instance.store = store
    instance.subscribers = []

    return instance
  }

  addSubscribers (subscribers) {
    instance.subscribers = instance.subscribers.concat(subscribers)
  }

  fetch () {
    const opts = {
      method: 'GET',
      baseUrl: API_URL,
      uri: '/v1/plugins/catalog',
      json: true
    }

    log.info(`Fetching latest plugin catalog from ${API_URL}...`)

    const req = request(opts, (error, response, body) => {
      console.log(body)
    })

    if (instance.subscribers.length) {
      for (const window of instance.subscribers) {
        window.webContents.send('catalog/FETCH_REQUEST')
      }
    }
  }

  enableAutoUpdate () {
    setInterval(instance.fetch, ms(CATALOG_FETCH_INTERVAL))
  }
}
