import { ipcRenderer } from 'electron'
import { installPluginRequest } from 'actions/plugin_manager'
import { difference,without,includes,has,uniq,xor } from 'lodash'
import writeSketchpack from 'lib/writeSketchpack'
import {
  exportSketchpackRequest,
  exportSketchpackSuccess,
  syncSketchpackRequest,
  syncSketchpackSuccess
} from 'reducers/sketchpack'

import {
  getSketchpackIdentifiers,
  selectPluginBasics,
  getManagedPlugins
} from 'reducers'

import { installPlugin,removePlugin } from 'reducers/library'

const syncMiddleware = store => next => action => {
  const prevIdentifiers = store.getState().sketchpack.plugins.allIdentifiers


  next(action)

  const managedIdentifiers = getManagedPlugins(store.getState())
  const nextIdentifiers = store.getState().sketchpack.plugins.allIdentifiers

  if (action.type !== syncSketchpackRequest.toString()) return

  if (!store.getState().sketchpack.isLoaded) return

  const addedIdentifiers = difference(nextIdentifiers,prevIdentifiers)
  const removedIdentifiers = difference(prevIdentifiers,nextIdentifiers)
  const installablePlugins = difference(addedIdentifiers,managedIdentifiers)

  if (installablePlugins.length > 0) {
    installPlugin(installablePlugins)
  }

  if (removedIdentifiers.length > 0) {
    removePlugin(
      removedIdentifiers.map(id => selectPluginBasics(store.getState(),id))
    )
  }

  store.dispatch(
    syncSketchpackSuccess({}, {
      added: addedIdentifiers,
      removed: removedIdentifiers
    })
  )

}

export default syncMiddleware
