const json5file = require('@sketchpacks/json5file')
const initialState = require('reducers/preferences')

const writePreferences = (filepath, contents, callback) => {
  const opts = {
    spaces: 2,
    flags: 'w',
    encoding: 'utf8'
  }

  const data = Object.assign({},
    initialState,
    contents
  )

  json5file.writeFile(filepath, data, opts, (err) => {
    if (err) console.error(err)

    callback()
  })
}

module.exports = writePreferences
