const {remote} = require('electron')
const path = require('path')
const {includes,values,reduce} = require('lodash')
const jsonfile = require('jsonfile')

const writeSketchpack = require('lib/writeSketchpack')
const {getReducedLibrary} = require('selectors')

const sketchpackPath = path.join(remote.app.getPath('userData'), 'my-library.sketchpack')

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
  const prevState = store.getState().sketchpack.items
  next(action)
  const nextState = store.getState().sketchpack.items

  const createNamespace = (contents) => reduce(nextState, ((result, value, key) => {
    result[`${value.owner}/${value.name}`] = value
    return result
  }), {})

  // If no sketchpack present, generate one from the library contents
  const contents = nextState.length > 0
    ? createNamespace(nextState)
    : getReducedLibrary(store.getState())

  if (includes(values(WATCHED_ACTIONS),action.type)) {
    writeSketchpack(sketchpackPath,contents || {})
  }
}

export default sketchpackMiddleware
