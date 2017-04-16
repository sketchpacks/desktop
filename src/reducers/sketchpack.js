import { createAction, handleActions } from 'redux-actions'

import {sanitizeSemVer} from 'lib/utils'
import semver from 'semver'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import {getPluginByIdentifier} from 'reducers/plugins'
import {detectPlugin} from 'reducers/library'


//- Actions

export const syncSketchpackContents = createAction('sketchpack/SYNC_CONTENTS')

export const setVersionRange = createAction('sketchpack/SET_VERSION_RANGE')


//- State

const initialState = {
  isLocked: false,
  pluginsByNamespace: {}
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
      }
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
    let plugin = action.payload.entities.plugins[action.payload.result]
    let owner = action.payload.entities.users[plugin.owner]

    const sanitizedVersion = sanitizeSemVer(plugin.version)

    return {
      ...state,
      pluginsByNamespace: {
        ...state.pluginsByNamespace,
        [`${owner.handle}/${plugin.name}`]: {
          version: plugin.version.indexOf('=') > -1
            ? `^${sanitizedVersion}`
            : `=${sanitizedVersion}`
        }
      }
    }
  }
}, initialState)


//- Selectors

export const getSketchpack = (state) => state
