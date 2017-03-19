const os = require('os')
const jsonfile = require('jsonfile')

const libraryPath = `${os.homedir()}/Desktop/sketchpack.json`

const sketchpackMiddleware = store => next => action => {
  next(action)

  const contents = {
    plugins: store.getState().library.items
  }

  jsonfile.writeFile(libraryPath, contents, {spaces: 2}, (err) => {
    if (err) console.error(err)
    console.log(contents)
  })

}

export default sketchpackMiddleware
