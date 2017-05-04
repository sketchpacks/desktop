const {remote} = require('electron')
const path = require('path')
const {includes,values,reduce,isEqual} = require('lodash')
const json5file = require('@sketchpacks/json5file')
const semver = require('semver')

const writeSketchpack = require('lib/writeSketchpack')

const sketchpackPath = path.join(remote.app.getPath('userData'), 'my-library.sketchpack')

const {
  getSketchpackIdentifiers,
  syncSketchpackContents
} = require('reducers')

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
  SKETCHPACK_SYNC_CONTENTS: 'sketchpack/SYNC_CONTENTS'
}

const sketchpackMiddleware = store => next => action => {
  const prevState = store.getState().sketchpack.plugins.byIdentifier
  next(action)
  const nextState = store.getState().sketchpack.plugins.byIdentifier

  if (isEqual(prevState,nextState)) return

  const identifiers = getSketchpackIdentifiers(store.getState())

  if (identifiers.length > 0) {
    const sketchpack = reduce(identifiers, (plugins, identifier) => {
      plugins[identifier] = {
        ...nextState[identifier]
      }
      return plugins
    }, nextState)

    writeSketchpack(
      sketchpackPath,
      sketchpack
    )
  }

}

export default sketchpackMiddleware
