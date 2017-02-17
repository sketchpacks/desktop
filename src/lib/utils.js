const sanitizeSemVer = (semver) => {
	if (typeof semver !== 'string') return false

  const x = semver.split('.')

  const major = x[0] || 0
  const minor = x[1] || 0
  const patch = x[2] || 0

  return [major,minor,patch].join('.')
}

module.exports = {
	sanitizeSemVer
}
