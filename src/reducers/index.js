import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { difference,filter,includes,intersection } from 'lodash'
import { createSelector } from 'reselect'
import { isSemverLocked } from 'lib/utils'
import semver from 'semver'

import plugins from 'reducers/plugins'
import users from 'reducers/users'
import library from 'reducers/library'
import sketchpack from 'reducers/sketchpack'
import search from 'reducers/search'

//- Reducer

const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  users,
  plugins,
  sketchpack,
  search
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

export const getSearchResults = (state) => getPluginIdentifiers(state.search)

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
  (id) => !isSemverLocked(state.sketchpack.plugins.byIdentifier[id].version)
)

export const getLockedPlugins = (state) => filter(
  state.sketchpack.plugins.allIdentifiers,
  (id) => isSemverLocked(state.sketchpack.plugins.byIdentifier[id].version)
)

export const getOutdatedPlugins = createSelector(
  [ getStateTree, getManagedPlugins ],
  (state,identifiers) => filter(
    identifiers,
    (id) => isSemverLocked(state.sketchpack.plugins.byIdentifier[id].version)
    && semver.lt(
      state.library.plugins.byIdentifier[id].version,
      state.plugins.byIdentifier[id].version
    )
  )
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
      data['install_path'] = lib.install_path
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
