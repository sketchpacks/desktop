const {reduce} = require('lodash')
const semver = require('semver')
const jsonfile = require('jsonfile')

const writeSketchpack = (filepath, contents) => {
  const reducedPlugins = (collection) => reduce(collection, ((result, value, key) => {
    result[`${value.owner.handle}/${value.name}`] = {
      name: value.name,
      owner: value.owner.handle,
      version: value.version || "^0.0.0",
      version_range: semver.toComparators(value.version || "^0.0.0")[0],
      compatible_version: value.compatible_version || "^0.0.0",
      compatible_version_range: semver.toComparators(value.compatible_version || "^0.0.0")[0],
    }

    return result
  }), {})

  const data = {
    name: "My Library",
    schema_version: '0.1.0',
    locked: false,
    plugins: reducedPlugins(contents)
  }

  const opts = {
    spaces: 2,
    flags: 'w',
    encoding: 'utf8'
  }

  jsonfile.writeFile(filepath, data, opts, (err) => {
    if (err) console.error(err)
  })
}

module.exports = writeSketchpack
