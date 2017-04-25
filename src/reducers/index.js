import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { difference,filter,includes,intersection } from 'lodash'
import { createSelector } from 'reselect'
import { isSemverLocked } from 'lib/utils'

import app from 'reducers/app'
import plugins from 'reducers/plugins'
import users from 'reducers/users'
import library from 'reducers/library'
import sketchpack from 'reducers/sketchpack'

//- Reducer

const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  app,
  users,
  plugins,
  sketchpack
})

export default rootReducer


//- Selectors

const getStateTree = (state) => state

export const getLibrary = (state) => state.library

export const getLibraryIdentifiers = (state) => state.library.plugins.allIdentifiers

export const getPlugins = (state) => state.plugins.byIdentifier

export const getPluginIdentifiers = (state) => state.plugins.allIdentifiers

export const getPluginByIdentifier = (state, identifier) => {
  const plugin = getPlugins(state)[identifier]
  return {
    ...plugin,
    owner: getUserById(state, plugin.owner)
  }
}

export const getUsers = (state) => state.users.byId

export const getUserById = (state, id) => getUsers(state)[id]

export const getSketchpack = (state) => state.sketchpack

export const getSketchpackIdentifiers = (state) => state.sketchpack.plugins.allIdentifiers

export const getPluginsList = (state) => getPluginIdentifiers(state)

export const getManagedPlugins = createSelector(
  [ getLibraryIdentifiers, getSketchpackIdentifiers ],
  (lib, pack) => intersection(pack,lib)
)

export const getUnmanagedPlugins = createSelector(
  [ getLibraryIdentifiers, getSketchpackIdentifiers ],
  (lib, pack) => difference(lib,pack)
)

export const getUnlockedPlugins = (state) => filter(
  state.sketchpack.plugins.allIdentifiers,
  (ns) => state.sketchpack.plugins.byIdentifier[ns].version.indexOf('=') === -1
)

export const getUpdatedPlugins = (state) => getPluginsList(state)

const pluginInstalled = (state,identifier) => {
  return includes(state.library.allIdentifiers,identifier)
}

export const checkForPluginInstallation = createSelector(
  [ pluginInstalled ], (installed) => installed
)

const getSketchpackPluginByIdentifier = (state,identifier) => {
  return state.sketchpack.plugins.byIdentifier[identifier]
}

const getLibraryPluginByIdentifier = (state,identifier) => {
  return state.library.plugins.byIdentifier[identifier]
}

export const selectPlugin = createSelector(
  [ getPluginByIdentifier, getLibraryPluginByIdentifier, getSketchpackPluginByIdentifier ],
  (entity, lib, pack) => {
    const data = entity

    if (lib) {
      data['installed_version'] = lib.version
    }

    if (pack) {
      data['version_range'] = pack.version
    }
    return data
  }
)

export const checkPluginLockState = createSelector(
  [ getSketchpack ],
  (pack) => {
    try {
      const plugin = pack.plugins.byIdentifier[identifier]
      console.log('checkPluginLockState',plugin)
      return isSemverLocked(plugin.version)
    } catch (err) {
      return false
    }
  }
)
