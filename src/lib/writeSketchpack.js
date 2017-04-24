const jsonfile = require('jsonfile')

const writeSketchpack = (filepath, contents) => {
  const data = {
    name: "My Library",
    schema_version: '1.0.0',
    locked: false,
    plugins: contents
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
