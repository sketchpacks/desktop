const sanitizeSemVer = (semver) => {
	if (typeof semver === undefined) return "0.0.0"
	if (typeof semver !== 'string') return "0.0.0"
	if (typeof semver === 'integer') return "0.0.0"
	if (semver === 0) return "0.0.0"
	if (semver === "0") return "0.0.0"

  const x = semver.split('.')

  const major = parseInt(x[0]) || 0
  const minor = parseInt(x[1]) || 0
  const patch = parseInt(x[2]) || 0

  return [major,minor,patch].join('.')
}

module.exports = {
	sanitizeSemVer
}
