import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { difference,filter,includes,intersection,pick } from 'lodash'
import { createSelector } from 'reselect'
import { isFullLocked } from 'lib/VersionLock'
import semver from 'semver'

import plugins from 'reducers/plugins'
import users from 'reducers/users'
import library from 'reducers/library'
import sketchpack from 'reducers/sketchpack'
import search from 'reducers/search'
import queue from 'reducers/queue'

//- Reducer

const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  users,
  plugins,
  sketchpack,
  search,
  queue
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

  const data = {
    ...plugin,
    owner: getUserById(state, plugin.owner)
  }

  return data
}

export const getPluginBasicsByIdentifier = (state, identifier) => {
  const plugin = getPlugins(state)[identifier]

  const data = pick(
    plugin,
    ['name', 'title', 'identifier', 'compatible_version', 'version', 'installed_version', 'install_path', 'manifest_path']
  )

  return data
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

export const getUnlockedPlugins = createSelector(
  [ getStateTree, getManagedPlugins ],
  (state,ids) => filter(
    ids,
    (id) => !isFullLocked(state.sketchpack.plugins.byIdentifier[id].version)
  )
)

export const getLockedPlugins = (state) => filter(
  state.sketchpack.plugins.allIdentifiers,
  (id) => isFullLocked(state.sketchpack.plugins.byIdentifier[id].version)
)

export const getOutdatedPlugins = createSelector(
  [ getStateTree, getManagedPlugins ],
  (state,identifiers) => filter(
    identifiers,
    (id) => {      
      if (!state.plugins.byIdentifier[id]) return false

      return isFullLocked(state.sketchpack.plugins.byIdentifier[id].version)
        && semver.lt(
          state.library.plugins.byIdentifier[id].version,
          state.plugins.byIdentifier[id].version
        )
    }
  )
)

const getSketchpackPluginByIdentifier = (state,identifier) => {
  return state.sketchpack.plugins.byIdentifier[identifier]
}

const getLibraryPluginByIdentifier = (state,identifier) => {
  return state.library.plugins.byIdentifier[identifier]
}

const getPluginInstallActivity = (state,identifier) => {
  return includes(state.queue.installing, identifier)
}

export const selectPlugin = createSelector(
  [
    getPluginByIdentifier,
    getLibraryPluginByIdentifier,
    getSketchpackPluginByIdentifier,
    getPluginInstallActivity
  ],
  (entity, lib, pack, isInstalling) => {
    const data = entity

    if (lib) {
      data['installed_version'] = lib.version
      data['install_path'] = lib.install_path
    }

    if (pack) {
      data['version_range'] = pack.version
    }

    data['isInstalling'] = isInstalling

    return data
  }
)

export const selectPluginBasics = createSelector(
  [
    getPluginBasicsByIdentifier,
    getLibraryPluginByIdentifier,
    getSketchpackPluginByIdentifier,
    getPluginInstallActivity
  ],
  (entity, lib, pack, isInstalling) => {
    const data = entity

    if (lib) {
      data['installed_version'] = lib.version
      data['install_path'] = lib.install_path
    }

    if (pack) {
      data['version_range'] = pack.version
    }

    data['isInstalling'] = isInstalling

    return data
  }
)

export const checkPluginLockState = createSelector(
  [ getSketchpack ],
  (pack) => {
    try {
      const plugin = pack.plugins.byIdentifier[identifier]
      console.log('checkPluginLockState',plugin)
      return isFullLocked(plugin.version)
    } catch (err) {
      return false
    }
  }
)
