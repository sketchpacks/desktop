import semver from 'semver'
import { createSelector } from 'reselect'
const {filter} = require('lodash')
import {sanitizeSemVer} from 'lib/utils'

const getList = (state) => state.app.location
const getPlugins = (state) => state.plugins.items
const getLibrary = (state) => state.library.items

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
