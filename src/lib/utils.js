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
  let semverStr = semver.toString()

	if (typeof semverStr === undefined) return "0.0.0"
	if (typeof semverStr === 'integer') return "0.0.0"
	if (semverStr === 0) return "0.0.0"
  if (semverStr === "0") return "0.0.0"

  const sanitize = (point) => parseInt(point.toString().replace(/[^0-9]/g, '')) || 0

  const x = semverStr.split('.')

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
  log.debug('Downloading: ', opts.plugin.name)
  let received_bytes = 0
  let total_bytes = 0
  let disposition
  let filename
  let savePath
  let out

  const req = request({
    method: 'GET',
    uri: opts.plugin.download_url,
    timeout: 1500
  })

  req.on('error', (err) => {
    if (err.code === 'ETIMEDOUT') log.debug('Timeout')
    if (err.connect === true) log.debug('Connection Timeout')
    reject(err)
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

    out.on('close', () => {
      resolve({
        plugin: opts.plugin,
        asset: {
          savePath: savePath,
          filename: filename
        }
      })
    })
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
})

const extractAsset = (data) => new Promise((resolve, reject) => {
  const archivePath = data.asset.savePath
  const extractionPath = getInstallPath()
  const {entryName} = new AdmZip(archivePath).getEntries()[0]

  data.plugin['install_path'] = path.join(extractionPath, entryName)

  exec(`unzip -o -a ${archivePath} -d ${extractionPath}`, (error, stdout, stderr) => {
    if (error) {
      log.info(`exec error: ${error}`)
      reject(error)
      return
    }
    log.info(`stdout: ${stdout}`)
    log.error(`stderr: ${stderr}`)

    resolve(data)
  })
})

const removeAsset = (data) => new Promise((resolve, reject) => {
  const {install_path} = data.plugin
  log.debug('Removing asset: ', install_path)
  exec(`rm -rf ${install_path}`, (error, stdout, stderr) => {
    if (error) {
      log.error(`exec error: ${error}`)
      reject(data)
      return
    }
    log.info(`stdout: ${stdout}`)
    log.error(`stderr: ${stderr}`)

    resolve(data)
  })
})

module.exports = {
	sanitizeSemVer,
	getInstallPath,
  extractAsset,
  downloadAsset,
  removeAsset
}
