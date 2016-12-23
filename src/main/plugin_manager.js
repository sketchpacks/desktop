const { app } = require('electron')
const request = require('request')
const fs = require('fs')
const path = require('path')

const install = (event, plugin) => {
  let bytesReceived = 0
  let bytesTotal = 0

  const DOWNLOAD_PATH = app.getPath('downloads')

  const req = request({
    method: 'GET',
    uri: plugin.download_url
  })

  let out = fs.createWriteStream(path.join(DOWNLOAD_PATH,`sketch-plugin-${plugin.id}.zip`))

  req.pipe(out)

  req.on('response', (data) => {
    bytesTotal = parseInt(data.headers['content-length'])
  })

  req.on('data', (chunk) => {
    bytesReceived += chunk.length

    if (bytesTotal !== 0) {
      event.sender.send('manager/INSTALL_PROGRESS', {
        plugin: plugin,
        progress: {
          bytesReceived: bytesReceived,
          bytesTotal: bytesTotal
        }
      })
    }

  })

  req.on('end', (chunk) => {
    event.sender.send('manager/INSTALL_SUCCESS', plugin)
  })
}

const uninstall = (event, plugin) => {
  event.sender.send('manager/UNINSTALL_SUCCESS', plugin)
}

const update = (event, plugin) => {
  event.sender.send('manager/UPDATE_SUCCESS', plugin)
}

module.exports = {
  install,
  uninstall,
  update
}
