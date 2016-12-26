const express = require('express')
const path = require('path')
const server = express()

const DIST_DIR = __dirname + '/dist'

server.use(express.static(DIST_DIR))

// Handles all routes so you do not get a not found error
server.get('*', function (request, response){
  response.sendFile(path.resolve(DIST_DIR, 'index.html'))
})

module.exports = server
