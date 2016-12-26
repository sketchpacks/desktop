import { createSelector } from 'reselect'
const _ = require('lodash')

const getLocation = (state) => state.app.location
const getPlugins = (state) => state.plugins.items

export const getPluginList = createSelector(
  [ getLocation, getPlugins ],
  (listFilter, plugins) => {
    switch (listFilter) {
      case '/library':
        return _.filter(plugins, {"installed": true})
      case '/browse':
      case '/browse/newest':
        return _.orderBy(plugins, ['updated_at'], ['desc'])
      case '/browse/popular':
        return _.orderBy(plugins, ['score'], ['asc'])
      default:
        return _.orderBy(plugins, ['updated_at'], ['desc'])
    }
  }
)
