import semver from 'semver'
import { createSelector } from 'reselect'
const {filter,reduce,find,reject} = require('lodash')
import {sanitizeSemVer} from '../lib/utils'

const getPlugins = (state) => state.plugins.items
const getLibrary = (state) => state.library.items
const getSketchpack = (state) => state.sketchpack.items

const getUserEntities = state => state.users
const getPluginEntities = state => state.plugins
const getPluginsByPopularity = state => state.pluginsByPopularity.ids

export const getPopularPlugins = createSelector(
  [ getPluginsByPopularity, getPluginEntities, getUserEntities ],
  (namespaces,plugins,users) => {
    return namespaces.map(n => {
      return {
        ...plugins[n],
        owner: users[plugins[n].owner]
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
