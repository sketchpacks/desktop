const { app } = require('electron')
const request = require('request')

const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const _ = require('lodash')
const IsThere = require("is-there")
const contentDisposition = require('content-disposition')
const AdmZip = require('adm-zip')

const {
  HOME_PATH,
  PLUGIN_PATHS
} = require('../config')

const TEMP_DIR_PATH = app.getPath('temp')
const DOWNLOAD_PATH = app.getPath('downloads')

const getInstallPath = () => {
  const installPath = _.find(PLUGIN_PATHS, (installPath) => {
    return IsThere(path.join(HOME_PATH,installPath))
  })

  return path.join(HOME_PATH,installPath).replace(/ /g, '\\ ')
}

const getSavePath = ((filename) => {
  return path.join(TEMP_DIR_PATH, filename)
})

const downloadAndExtract = (plugin) => {
  const { download_url } = plugin

  const opts = {
    method: 'GET',
    uri: download_url
  }

  request(opts)
    .on('response', (response) => {
      const disposition = response.headers['content-disposition']
      const filename = contentDisposition.parse(disposition)['parameters']['filename']
      const savePath = getSavePath(filename)
      const archiveFileStream = fs.createWriteStream(savePath)

      archiveFileStream.on('finish', () => {
        exec(`unzip -o -a ${savePath} -d ${getInstallPath()}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)
        })
      })

      response.pipe(archiveFileStream)
    })
}

const install = (event, plugin) => {
  downloadAndExtract(plugin)
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
