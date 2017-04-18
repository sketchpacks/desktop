import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { createSelector } from 'reselect'

import { difference } from 'lodash'

import app from 'reducers/app'
import plugins from 'reducers/plugins'
import users from 'reducers/users'
import library from 'reducers/library'
import sketchpack from 'reducers/sketchpack'

//- Reducer

const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  app,
  users,
  plugins,
  sketchpack
})

export default rootReducer


//- Selectors

export const getPlugins = (state) => state.plugins.byIdentifier

export const getPluginIdentifiers = (state) => state.plugins.allIdentifiers

export const getPluginByIdentifier = (state, identifier) => {
  const plugin = getPlugins(state)[identifier]
  return {
    ...plugin,
    owner: getUserById(state, plugin.owner)
  }
}

export const getPluginByNamespace = (state, namespace) => {
  const identifier = state.plugins.byNamespace[namespace]
  return getPluginByIdentifier(state, identifier)
}

export const getUsers = (state) => state.users.byId

export const getUserById = (state, id) => getUsers(state)[id]

export const getSketchpack = (state) => state.sketchpack

export const getSketchpackNamespaces = (state) => state.sketchpack.allNamespaces

export const getPluginsList = (state) => getPluginIdentifiers(state)
  .map(identifier => getPluginByIdentifier(state, identifier))

export const getManagedPlugins = (state) => getSketchpackNamespaces(state)
  .map(ns => getPluginByNamespace(state, ns))

export const getUnmanagedPlugins = (state) => {
  const sketchpackIdentifiers = getSketchpackNamespaces(state)
    .map(ns => state.plugins.byNamespace[ns])

  const libraryIdentifiers = state.library.allIdentifiers

  return difference(libraryIdentifiers, sketchpackIdentifiers)
    .map(identifier => getPluginByIdentifier(state,identifier))
}
