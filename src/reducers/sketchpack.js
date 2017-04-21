import { createAction, handleActions } from 'redux-actions'

import {uniq} from 'lodash'

import {sanitizeSemVer} from 'lib/utils'
import semver from 'semver'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import {detectPlugin} from 'reducers/library'


//- Actions

export const syncSketchpackContents = createAction('sketchpack/SYNC_CONTENTS')

export const setVersionRange = createAction('sketchpack/SET_VERSION_RANGE')


//- State

const initialState = {
  isLocked: false,
  plugins: {
    allNamespaces: [],
    byNamespace: {}
  }
}


//- Reducers

export default handleActions({
  [syncSketchpackContents]: (state, action) => {
    return {
      ...state,
      name: action.payload.name,
      isLocked: action.payload.locked,
      plugins: {
        ...state.plugins,
        byNamespace: {
          ...state.plugins.byNamespace,
          ...action.payload.plugins
        },
        allNamespaces: uniq(
          state.plugins.allNamespaces.concat(Object.keys(action.payload.plugins))
        )
      }
    }
  },

  [setVersionRange]: (state, action) => {
    const sanitizedVersion = sanitizeSemVer(action.payload.version)

    let plugin = state.plugins.byNamespace[action.payload.namespace]

    return {
      ...state,
      plugins: {
        ...state.plugins,
        byNamespace: {
          ...state.plugins.byNamespace,
          [action.payload.namespace]: {
            ...plugin,
            version: plugin.version.indexOf('=') > -1
            ? `^${sanitizedVersion}`
            : `=${sanitizedVersion}`
          }
        }
      }
    }
  },

  [detectPlugin]: (state, action) => {
    let { entities, result } = action.payload

    if (entities.plugins[result].owner === undefined) return state

    let plugin = entities.plugins[result]
    let owner = entities.users[plugin.owner].handle

    const sanitizedVersion = sanitizeSemVer(plugin.version)

    return {
      ...state,
      plugins: {
        ...state.plugins,
        byNamespace: {
          ...state.plugins.byNamespace,
          [`${owner}/${plugin.name}`]: {
            version: plugin.version.indexOf('=') > -1
              ? `^${sanitizedVersion}`
              : `=${sanitizedVersion}`
          }
        }
      }
    }
  }
}, initialState)
