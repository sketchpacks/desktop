import { createSelector } from 'reselect'
const _ = require('lodash')

const getListFilter = (state) => state.app.listFilter
const getPlugins = (state) => state.plugins.items

export const getPluginList = createSelector(
  [ getListFilter, getPlugins ],
  (listFilter, plugins) => {
    switch (listFilter) {
      case 'SHOW_ALL':
        return _.orderBy(plugins, ['updated_at'], ['desc'])
      case 'SHOW_INSTALLED':
        return _.filter(plugins, {"installed": true})
      case 'SHOW_NEWEST':
        return _.orderBy(plugins, ['published'], ['desc'])
      case 'SHOW_POPULAR':
        return _.orderBy(plugins, ['score'], ['asc'])
    }
  }
)
