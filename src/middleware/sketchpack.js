const {includes,values} = require('lodash')
const os = require('os')
const jsonfile = require('jsonfile')
const libraryPath = `${os.homedir()}/Desktop/sketchpack.json`
const {
  TOGGLE_VERSION_LOCK_SUCCESS,
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
} = require('actions/plugin_manager')

const WATCHED_ACTIONS = {
  TOGGLE_VERSION_LOCK_SUCCESS,
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
}

const {fetchLibraryReceived} = require('../actions/index')

const sketchpackMiddleware = store => next => action => {
  // console.log(values(WATCHED_ACTIONS),action.type,includes(values(WATCHED_ACTIONS),action.type))
  const prevState = store.getState().library.items
  next(action)
  const nextState = store.getState().library.items

  if (includes(values(WATCHED_ACTIONS),action.type)) {
    const data = {
      plugins: store.getState().library.items
    }

    jsonfile.writeFile(libraryPath, data, {spaces: 2}, (err) => {
      if (err) console.error(err)
      store.dispatch(fetchLibraryReceived(data.plugins))
    })
  }
}

export default sketchpackMiddleware
