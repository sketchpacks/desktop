const json5file = require('@sketchpacks/json5file')

const writeSketchpack = (filepath, contents, callback) => {
  const opts = {
    spaces: 2,
    flags: 'w',
    encoding: 'utf8'
  }

  const defaults = {
    name: "My Library",
    schema_version: '1.0.0',
    locked: false,
    plugins: {}
  }

  const data = Object.assign({},
    defaults,
    contents
  )

  json5file.writeFile(filepath, data, opts, (err) => {
    if (err) console.error(err)

    callback()
  })
}

module.exports = writeSketchpack
