const {remote} = require('electron')
const path = require('path')
const {includes,values,reduce,isEqual,difference} = require('lodash')
const json5file = require('@sketchpacks/json5file')
const semver = require('semver')

const writeSketchpack = require('lib/writeSketchpack')

const sketchpackPath = path.join(remote.app.getPath('userData'), 'my-library.sketchpack')

const {
  getSketchpackIdentifiers,
  syncSketchpackContents
} = require('reducers')

const {
  importSketchpackSuccess,
  exportSketchpackRequest
} = require('reducers/sketchpack')

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
  SKETCHPACK_SYNC_CONTENTS: 'sketchpack/SYNC'
}

const sketchpackMiddleware = store => next => action => {
  const prevSketchpack = store.getState().sketchpack.plugins
  next(action)
  const nextSketchpack = store.getState().sketchpack.plugins

  if (store.getState().sketchpack.isLocked) return

  const addedPlugins = difference(prevSketchpack.allIdentifiers,nextSketchpack.allIdentifiers)
  const removedPlugins = difference(nextSketchpack.allIdentifiers,prevSketchpack.allIdentifiers)

  if ((addedPlugins.length > 0) || (removedPlugins.length > 0)) {
    store.dispatch(exportSketchpackRequest(sketchpackPath))
  }
}

export default sketchpackMiddleware
