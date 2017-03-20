const sanitizeSemVer = (semver) => {
	if (typeof semver === undefined) return "0.0.0"
	if (typeof semver !== 'string') return "0.0.0"
	if (typeof semver === 'integer') return "0.0.0"
	if (semver === 0) return "0.0.0"
	if (semver === "0") return "0.0.0"

  const sanitize = (point) => point.toString().replace(/[^0-9]/g, '')

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

module.exports = {
	sanitizeSemVer
}
