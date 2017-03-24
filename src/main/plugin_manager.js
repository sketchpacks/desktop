const { app } = require('electron')
const request = require('request')
const Promise = require('promise')
const log = require('electron-log')

const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const {find} = require('lodash')
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
  const installPath = find(PLUGIN_PATHS, (installPath) => {
    return IsThere(path.join(HOME_PATH,installPath))
  })

  return path.join(HOME_PATH,installPath).replace(/ /g, '\\ ')
}

const getSavePath = ((filename) => {
  return path.join(TEMP_DIR_PATH, filename)
})

const install = (event, plugin) => {
  const { id, name, download_url, version } = plugin

  const opts = {
    method: 'GET',
    uri: download_url
  }

  return new Promise ((resolve, reject) => {
    request(opts)
      .on('response', (response) => {
        let disposition
        let filename

        try {
          disposition = response.headers['content-disposition']
          filename = contentDisposition.parse(disposition)['parameters']['filename']
        } catch (err) {
          log.error(err)
          filename = `sketch-plugin-${id}.zip`
        }

        log.info(filename)

        const savePath = getSavePath(filename)
        const archiveFileStream = fs.createWriteStream(savePath)
        const installPath = getInstallPath()

        let extractionPath

        archiveFileStream.on('finish', () => {
          exec(`unzip -o -a ${savePath} -d ${installPath}`, (error, stdout, stderr) => {
            if (error) {
              log.info(`exec error: ${error}`)
              reject(error)
              return
            }
            log.info(`stdout: ${stdout}`)
            log.error(`stderr: ${stderr}`)
          })

          extractionPath = new AdmZip(savePath).getEntries()[0].entryName

          resolve(Object.assign(plugin, {
            install_path: path.join(getInstallPath(), extractionPath),
            version: version,
          }))
        })

        response.pipe(archiveFileStream)
      })
  })
}

const uninstall = (event, plugin) => {
  const { id, name, install_path } = plugin

  return new Promise((resolve, reject) => {
    exec(`rm -rf ${install_path}`, (error, stdout, stderr) => {
      if (error) {
        log.error(`exec error: ${error}`)
        reject(error)
        return
      }
      log.info(`stdout: ${stdout}`)
      log.error(`stderr: ${stderr}`)
    })

    resolve(plugin)
  })
}

module.exports = {
  install,
  uninstall
}
