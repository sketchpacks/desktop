import semver from 'semver'
import { createSelector } from 'reselect'
const {filter,reduce,find,reject} = require('lodash')
import {sanitizeSemVer} from '../lib/utils'

import { getPluginEntities } from 'reducers/plugins'
import { getUserEntities } from 'reducers/users'
import { getLibrary, getLibraryEntities } from 'reducers/library'

const getPluginsByPopularity = state => state.plugins.allIdentifiers
const getInstalledIdentifiers = state => state.plugins.installedIndentifiers

const getSketchpack = (state) => state.sketchpack.items

export const getPopularPlugins = createSelector(
  [ getPluginsByPopularity, getPluginEntities, getUserEntities ],
  (identifiers,plugins,users) => {
    return identifiers.map(id => {
      return {
        ...plugins[id],
        owner: users[plugins[id].owner]
      }
    })
  }
)

export const getInstalledPlugins = createSelector(
  [ getLibraryEntities, getPluginEntities, getUserEntities ],
  (library, plugins, users) => {
    return Object.keys(library).map(id => {
      return {
        ...plugins[id],
        owner: users[plugins[id].owner]
      }
    })
  }
)

export const getPluginList = (state) => {
  try {
    const list = state.app.location.split('/')
    return list[list.length-1]
  } catch (err) {
    return 'popular'
  }
}

const hasNewVersion = (plugin) => {
  if (plugin.installed === undefined) return false
  if (!plugin.installed) return false

  let remoteVersion = plugin.version
  let localVersion = plugin.installed_version

  return plugin.installed
    && semver.lt(sanitizeSemVer(localVersion),sanitizeSemVer(remoteVersion))
}

export const getUpdatedPlugins = createSelector(
  [ getLibrary ], (plugins) => {
    return filter(plugins, (p => hasNewVersion(p)))
  }
)

export const getUpdatesCount = createSelector(
  [ getUpdatedPlugins ], (plugins) => {
    return plugins.length
  }
)

export const getReducedLibrary = createSelector(
  [ getLibrary ], (plugins) => reduce(plugins, ((result, value, key) => {
    result[`${value.owner.handle}/${value.name}`] = {
      name: value.name,
      owner: value.owner.handle,
      version: sanitizeSemVer(value.version),
      compatible_version: sanitizeSemVer(value.compatible_version),
    }

    return result
  }), {})
)

export const getUnmanagedPlugins = createSelector(
  [ getReducedLibrary, getSketchpack ], (library,sketchpack) => {
    return reject(library, (lib) => find(sketchpack, (p) => {
      return lib.name === p.name && lib.owner === p.owner
    }))
  })

export const getManagedPlugins = createSelector(
  [ getReducedLibrary, getSketchpack ], (library,sketchpack) => {
    return filter(library, (lib) => find(sketchpack, (p) => {
      return lib.name === p.name && lib.owner === p.owner
    }))
  })

export const getLockedPlugins = createSelector(
  [ getManagedPlugins, getSketchpack ], (library,sketchpack) => {
    return reject(library, (lib) => find(sketchpack, (p) => {
      return p.name === lib.name
        && p.owner === lib.owner
        && p.version_range.length > 1
    }))
  })

  export const getUnlockedPlugins = createSelector(
    [ getManagedPlugins, getSketchpack ], (library,sketchpack) => {
      return reject(library, (lib) => find(sketchpack, (p) => {
        return p.name === lib.name
          && p.owner === lib.owner
          && p.version_range.length === 1
      }))
    })
