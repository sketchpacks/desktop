const {find} = require('lodash')
const path = require('path')
const IsThere = require("is-there")

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

module.exports = {
	sanitizeSemVer,
	getInstallPath
}
