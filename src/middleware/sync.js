import { ipcRenderer } from 'electron'
import { installPluginRequest } from 'actions/plugin_manager'
import { difference,without } from 'lodash'
import writeSketchpack from 'lib/writeSketchpack'
import { exportSketchpackRequest,exportSketchpackSuccess,syncSketchpackSuccess } from 'reducers/sketchpack'

const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

const {
  getSketchpackIdentifiers,
  syncSketchpackContents
} = require('reducers')

const syncMiddleware = store => next => action => {
  const prevIdentifiers = Object.keys(store.getState().sketchpack.plugins.byIdentifier)
  next(action)
  const nextIdentifiers = Object.keys(store.getState().sketchpack.plugins.byIdentifier)

  const currentLibrary = Object.keys(store.getState().library.plugins.allIdentifiers)

  if (action.type !== 'sketchpack/SYNC_REQUEST') return

  const addedIdentifiers = difference(nextIdentifiers,prevIdentifiers)
  const removedIdentifiers = difference(prevIdentifiers,nextIdentifiers)
  const installablePlugins = without(addedIdentifiers,currentLibrary)

  if (!store.getState().sketchpack.isLoaded) return

  if ((installablePlugins.length > 0) && without(installablePlugins,store.getState().queue.installing)) {
    ipcRenderer.send(INSTALL_PLUGIN_REQUEST, installablePlugins)
  }

  store.dispatch(
    syncSketchpackSuccess({}, {
      added: addedIdentifiers,
      removed: removedIdentifiers
    })
  )

}

export default syncMiddleware
