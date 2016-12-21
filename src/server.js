const express = require('express')
const path = require('path')
const server = express()

const outputDir = __dirname + '/dist'

server.use(express.static(outputDir))

// Handles all routes so you do not get a not found error
server.get('*', function (request, response){
    response.sendFile(path.resolve(outputDir, 'index.html'))
})

module.exports = server
