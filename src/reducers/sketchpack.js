import { createAction, handleActions } from 'redux-actions'

import {uniq} from 'lodash'

import {sanitizeSemVer,isSemverLocked} from 'lib/utils'
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
    allIdentifiers: [],
    byIdentifier: {}
  }
}


//- Reducers

export default handleActions({
  [syncSketchpackContents]: (state, action) => {
    console.log(syncSketchpackContents,action)
    return {
      ...state,
      name: action.payload.name,
      isLocked: action.payload.locked,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.byIdentifier,
          ...action.payload.plugins
        }
      }
    }
  },

  [setVersionRange]: (state, action) => {
    const sanitizedVersion = sanitizeSemVer(action.payload.version)

    let plugin = state.plugins.byIdentifier[action.payload.identifier]

    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [action.payload.identifier]: {
            ...plugin,
            version: toggleSemverLock(plugin.version)
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

    let identifier = plugin.identifier

    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [identifier]: {
            version: sanitizeSemVer(plugin.version)
          }
        },
        allIdentifiers: uniq(
          state.plugins.allIdentifiers.concat(identifier)
        )
      }
    }
  }
}, initialState)
