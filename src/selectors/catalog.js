import { createSelector } from 'reselect'
const {filter,orderBy} = require('lodash')

const getLocation = (state) => state.app.location
const getPlugins = (state) => state.plugins.items

export const getPluginList = createSelector(
  [ getLocation, getPlugins ],
  (listFilter, plugins) => {
    switch (listFilter) {
      case '/library':
        return filter(plugins, {"installed": true})
      case '/browse':
      case '/browse/newest':
        return orderBy(plugins, ['updated_at'], ['desc'])
      case '/browse/popular':
        return orderBy(plugins, ['score'], ['desc'])
      default:
        return orderBy(plugins, ['updated_at'], ['desc'])
    }
  }
)
