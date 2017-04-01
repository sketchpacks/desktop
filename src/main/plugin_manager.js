const { app } = require('electron')
const request = require('request')
const Promise = require('promise')
const log = require('electron-log')

const async = require('async')
const fs = require('fs')
const path = require('path')
const {find} = require('lodash')
const IsThere = require("is-there")
const AdmZip = require('adm-zip')

const {extractAsset,downloadAsset} = require('../lib/utils')

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

  async.waterfall([
    // Download
    (callback) => {
      downloadAsset({
        plugin: plugin,
        destinationPath: TEMP_DIR_PATH,
        onProgress: (received,total) => {
          let percentage = (received * 100) / total;
          log.debug(percentage + "% | " + received + " bytes out of " + total + " bytes.")
        }
      })
      .then((assetInfo) => {
        callback(null, assetInfo)
      })
      .catch((err) => {
        log.error('Error', err)
        callback(err, null)
      })
    },

    // Extract
    (asset, callback) => {
      extractAsset(asset.savePath,getInstallPath())
        .then(path => {
          callback(null, {
            install_path: path,
            version: version
          })
        })
        // .then(path => resolve(Object.assign(plugin, {
        //   install_path: path.join(getInstallPath(), path),
        //   version: version
        // })))
    }
  ], (err, results) => {
    log.debug(results)
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
