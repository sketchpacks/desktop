const fs = require('fs')
const Promise = require('promise')
const request = require('request')
const {find} = require('lodash')
const path = require('path')
const IsThere = require("is-there")

const log = require('electron-log')
const AdmZip = require('adm-zip')
const exec = require('child_process').exec
const contentDisposition = require('content-disposition')

const {
  HOME_PATH,
  PLUGIN_PATHS
} = require('../config')

const sanitizeSemVer = (semver) => {
	if (typeof semver === undefined) return "0.0.0"
	if (typeof semver !== 'string') return "0.0.0"
	if (typeof semver === 'integer') return "0.0.0"
	if (semver === 0) return "0.0.0"
	if (semver === "0") return "0.0.0"

  const sanitize = (point) => parseInt(point.toString().replace(/[^0-9]/g, ''))

  const x = semver.split('.')

  const major = x[0] || 0
  const minor = x[1] || 0
  const patch = x[2] || 0

  return [
			sanitize(major),
			sanitize(minor),
			sanitize(patch)
		].join('.')
}

const getInstallPath = () => {
  const installPath = find(PLUGIN_PATHS, (installPath) => {
    return IsThere(path.join(HOME_PATH,installPath))
  })

  return path.join(HOME_PATH,installPath).replace(/ /g, '\\ ')
}

const downloadAsset = (opts) => new Promise((resolve, reject) => {
  let received_bytes = 0
  let total_bytes = 0
  let disposition
  let filename
  let savePath

  const req = request({
    method: 'GET',
    uri: opts.plugin.download_url
  })

  req.on('response', (data) => {
    total_bytes = parseInt(data.headers['content-length' ])

    try {
      disposition = data.headers['content-disposition']
      filename = contentDisposition.parse(disposition)['parameters']['filename']
    } catch (err) {
      log.error(err)
      filename = `sketch-plugin-${opts.plugin.id}.zip`
    }

    savePath = path.join(opts.destinationPath,filename)
    const out = fs.createWriteStream(savePath)

    req.pipe(out)
  })

  if (opts.hasOwnProperty("onProgress")){
    req.on('data', (chunk) => {
      received_bytes += chunk.length

      opts.onProgress(received_bytes, total_bytes)
    })
  } else {
    req.on('data', (chunk) => {
      received_bytes += chunk.length
    })
  }

  req.on('end', () => {
    resolve({
      filename,
      savePath
    })
  })
})

const extractAsset = (archivePath,extractionPath) => {
  return new Promise((resolve, reject) => {
    exec(`unzip -o -a ${archivePath} -d ${extractionPath}`, (error, stdout, stderr) => {
      if (error) {
        log.info(`exec error: ${error}`)
        reject(error)
        return
      }
      log.info(`stdout: ${stdout}`)
      log.error(`stderr: ${stderr}`)

      resolve(new AdmZip(archivePath).getEntries()[0].entryName)
    })
  })
}

module.exports = {
	sanitizeSemVer,
	getInstallPath,
  extractAsset,
  downloadAsset
}
