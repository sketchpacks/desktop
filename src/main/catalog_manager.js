const log = require('electron-log')
const request = require('request')
const {
  API_URL
} = require('../config')

const fetch = () => {
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

}

module.exports = {
  fetch
}
