const {remote} = require('electron')
const path = require('path')
const {includes,values} = require('lodash')
const jsonfile = require('jsonfile')

const writeSketchpack = require('lib/writeSketchpack')

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
  const prevState = store.getState().library.items
  next(action)
  const nextState = store.getState().library.items

  if (includes(values(WATCHED_ACTIONS),action.type)) {
    writeSketchpack(sketchpackPath,store.getState().library.items)
  }
}

export default sketchpackMiddleware
