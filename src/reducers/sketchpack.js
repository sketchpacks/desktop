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
  pluginsByNamespace: {},
  allNamespaces: [],
  allIdentifiers: []
}


//- Reducers

export default handleActions({
  [syncSketchpackContents]: (state, action) => {
    return {
      ...state,
      name: action.payload.name,
      isLocked: action.payload.locked,
      pluginsByNamespace: {
        ...state.pluginsByNamespace,
        ...action.payload.plugins
      },
      allNamespaces: uniq(
        state.allNamespaces.concat(Object.keys(action.payload.plugins))
      )
    }
  },

  [setVersionRange]: (state, action) => {
    const sanitizedVersion = sanitizeSemVer(action.payload.version)

    let plugin = state.pluginsByNamespace[action.payload.namespace]

    return {
      ...state,
      pluginsByNamespace: {
        ...state.pluginsByNamespace,
        [action.payload.namespace]: {
          ...plugin,
          version: plugin.version.indexOf('=') > -1
            ? `^${sanitizedVersion}`
            : `=${sanitizedVersion}`
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
      pluginsByNamespace: {
        ...state.pluginsByNamespace,
        [`${owner}/${plugin.name}`]: {
          version: plugin.version.indexOf('=') > -1
            ? `^${sanitizedVersion}`
            : `=${sanitizedVersion}`
        }
      },
      allIdentifiers: uniq(state.allIdentifiers.concat(result))
    }
  }
}, initialState)


//- Selectors

export const getSketchpack = (state) => state.sketchpack
