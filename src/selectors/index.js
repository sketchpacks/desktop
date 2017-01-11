import semver from 'semver'
import { createSelector } from 'reselect'
const _ = require('lodash')

const getList = (state) => state.app.location
const getPlugins = (state) => state.plugins.items

export const getAllPlugins = createSelector(
  [ getPlugins ], (plugins) => {
    return plugins
  }
)

export const getPopularPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return _.orderBy(plugins, ['score'], ['desc'])
  }
)

export const getNewestPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return _.orderBy(plugins, ['updated_at'], ['desc'])
  }
)

export const getInstalledPlugins = createSelector(
  [ getAllPlugins ], (plugins) => {
    return _.filter(plugins, {"installed": true})
  }
)

const sanitizeVersion = (version) => {
  if (version === "0") return "0.0.0"

  return version
}

const hasNewVersion = (plugin) => {
  if (plugin.installed === undefined) return false
  if (!plugin.installed) return false

  let remoteVersion = plugin.version
  let localVersion = plugin.installed_version

  return plugin.installed
    && semver.lt(sanitizeVersion(localVersion),sanitizeVersion(remoteVersion))
}

export const getUpdatedPlugins = createSelector(
  [ getInstalledPlugins ], (plugins) => {
    return _.filter(plugins, (p => hasNewVersion(p)))
  }
)

export const getUpdatesCount = createSelector(
  [ getUpdatedPlugins ], (plugins) => {
    return plugins.length
  }
)
