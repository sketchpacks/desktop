import semver from 'semver'
import { createSelector } from 'reselect'
const {filter,reduce,find,reject,difference} = require('lodash')
import {sanitizeSemVer} from '../lib/utils'

import { getPlugins, getPluginEntities } from 'reducers/plugins'
import { getUserEntities } from 'reducers/users'
import { getLibrary, getLibraryEntities } from 'reducers/library'
import { getSketchpack } from 'reducers/sketchpack'

const getPluginsByPopularity = state => state.plugins.allIdentifiers
const getInstalledIdentifiers = state => state.plugins.installedIndentifiers

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

export const getManagedPlugins = createSelector(
  [ getSketchpack, getLibrary, getPluginEntities, getUserEntities ],
  (sketchpack, library, plugins, users) => {
    return sketchpack.allIdentifiers.map(id => {
      return {
        ...plugins[id],
        owner: users[plugins[id].owner]
      }
    })
  }
)

export const getUnmanagedPlugins = createSelector(
  [ getSketchpack, getLibrary, getPluginEntities, getUserEntities ],
  (sketchpack, library, plugins, users) => {
    const unmanagedIdentifiers = difference(library.allIdentifiers, sketchpack.allIdentifiers)
    return unmanagedIdentifiers.map(id => {
      return {
        ...plugins[id],
        owner: users[plugins[id].owner]
      }
    })
  }
)

export const getUnlockedPlugins = createSelector(
  [ getSketchpack, getLibrary, getPlugins, getUserEntities ],
  (sketchpack, library, plugins, users) => {

    let namespaces = filter(
      sketchpack.allNamespaces,
      (n) => sketchpack.pluginsByNamespace[n].version.indexOf('=') === -1
    )

    let managed = namespaces.map(namespace => {
      let identifier = plugins.byNamespace[namespace]
      return plugins.byIdentifier[identifier]
    })

    return managed
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
