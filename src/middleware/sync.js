import { ipcRenderer } from 'electron'
import { installPluginRequest } from 'actions/plugin_manager'
import { difference,without,includes } from 'lodash'
import writeSketchpack from 'lib/writeSketchpack'
import { exportSketchpackRequest,exportSketchpackSuccess,syncSketchpackSuccess } from 'reducers/sketchpack'

const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

import {
  getSketchpackIdentifiers,
  selectPluginBasics
} from 'reducers'

import { installPlugin,removePlugin } from 'reducers/library'

const syncMiddleware = store => next => action => {
  const prevIdentifiers = Object.keys(store.getState().sketchpack.plugins.byIdentifier)
  next(action)

  const overwatchEnabled = store.getState().sketchpack.overwatch

  const nextIdentifiers = Object.keys(store.getState().sketchpack.plugins.byIdentifier)

  const currentLibrary = Object.keys(store.getState().library.plugins.allIdentifiers)

  if (!overwatchEnabled) return

  if (action.type !== 'sketchpack/SYNC_REQUEST') return

  const addedIdentifiers = difference(nextIdentifiers,prevIdentifiers)
  const removedIdentifiers = difference(prevIdentifiers,nextIdentifiers)

  const installablePlugins = without(addedIdentifiers,currentLibrary)

  if (!store.getState().sketchpack.isLoaded) return

  if ((installablePlugins.length > 0) && without(installablePlugins,store.getState().queue.installing)) {
    installPlugin(installablePlugins)
  }

  if ((removedIdentifiers.length > 0) && without(removedIdentifiers,store.getState().queue.uninstalling)) {
    removePlugin(removedIdentifiers.map(id => selectPluginBasics(store.getState(),id)))
  }

  store.dispatch(
    syncSketchpackSuccess({}, {
      added: addedIdentifiers,
      removed: removedIdentifiers
    })
  )

}

export default syncMiddleware
