import semver from 'semver'
import { createSelector } from 'reselect'
const {filter,orderBy,find} = require('lodash')
const {forEach} = require('lodash')
import {sanitizeSemVer} from 'lib/utils'


const getList = (state) => state.app.location
const getPlugins = (state) => state.plugins.items
const getSearchResultIds = (state) => state.search.items

export const getAllPlugins = createSelector(
  [ getPlugins ], (plugins) => {
    return plugins
  }
)

export const getPopularPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return orderBy(plugins, ['score'], ['desc'])
  }
)

export const getNewestPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return orderBy(plugins, ['updated_at'], ['desc'])
  }
)

export const getInstalledPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return filter(plugins, {"installed": true})
  }
)

const hasNewVersion = (plugin) => {
  if (plugin.installed === undefined) return false
  if (!plugin.installed) return false

  let remoteVersion = plugin.version
  let localVersion = plugin.installed_version

  return plugin.installed
    && semver.lt(sanitizeSemVer(localVersion),sanitizeSemVer(remoteVersion))
}

export const getUpdatedPlugins = createSelector(
  [ getInstalledPlugins ], (plugins) => {
    return filter(plugins, (p => hasNewVersion(p)))
  }
)

export const getUpdatesCount = createSelector(
  [ getUpdatedPlugins ], (plugins) => {
    return plugins.length
  }
)

export const getSearchResults = createSelector(
  [ getAllPlugins, getSearchResultIds ],
  (plugins, ids) => {
    let results = []
    forEach(ids, (id) => {
      results.push(find(plugins, ['id', id]))
    })

    return results
  }
)
