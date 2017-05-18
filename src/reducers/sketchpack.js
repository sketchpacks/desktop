import { createAction, handleActions } from 'redux-actions'

import {uniq,includes,isObject,has,pickBy,filter} from 'lodash'

import { sanitizeSemVer } from 'lib/utils'

import semver from 'semver'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import {
  detectPlugin,
  identifyPlugin,
  removePlugin
} from 'reducers/library'

import {
  setVersionLock
} from 'lib/VersionLock'



//- Actions

export const syncSketchpackRequest = createAction('sketchpack/SYNC_REQUEST')
export const syncSketchpackSuccess = createAction('sketchpack/SYNC_SUCCESS')
export const syncSketchpackError = createAction('sketchpack/SYNC_ERROR')

export const setVersionRange = createAction('sketchpack/SET_VERSION_RANGE', (payload) => payload, (_,meta) => meta)

export const importSketchpackRequest = createAction('sketchpack/IMPORT_REQUEST')
export const importSketchpackSuccess = createAction('sketchpack/IMPORT_SUCCESS', (payload) => payload, (_,meta) => meta)
export const importSketchpackError = createAction('sketchpack/IMPORT_ERROR')

export const exportSketchpackRequest = createAction('sketchpack/EXPORT_REQUEST')
export const exportSketchpackSuccess = createAction('sketchpack/EXPORT_SUCCESS', (payload) => payload, (_,meta) => meta)
export const exportSketchpackError = createAction('sketchpack/EXPORT_ERROR')

//- State

const initialState = {
  isLocked: false,
  isImporting: false,
  plugins: {
    allIdentifiers: [],
    byIdentifier: {}
  }
}


//- Reducers

export default handleActions({
  [syncSketchpackRequest]: (state, action) => {
    return {
      ...state,
      name: action.payload.name,
      isLocked: action.payload.locked,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.byIdentifier,
          ...action.payload.plugins
        },
        allIdentifiers: uniq(
          state.plugins.allIdentifiers.concat(
            Object.keys(action.payload.plugins)
          )
        )
      }
    }
  },

  [setVersionRange]: (state, action) => {
    const {identifier,version,lock_strength} = action.payload
    const plugin = state.plugins.byIdentifier[identifier]
    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [identifier]: {
            ...plugin,
            version: setVersionLock({ semver: version, lock: lock_strength})
          }
        }
      }
    }
  },

  [detectPlugin]: (state, action) => {
    let { entities, result } = action.payload

    let plugin = entities.plugins[result]

    let identifier = plugin.identifier

    if (has(state.plugins.byIdentifier,identifier)) {
      return {
        ...state
      }
    }

    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [identifier]: {
            version: setVersionLock({ semver: plugin.version, lock: 'locked'})
          }
        },
        allIdentifiers: uniq(
          state.plugins.allIdentifiers.concat(identifier)
        )
      }
    }
  },

  [removePlugin]: (state,action) => ({
    ...state,
    plugins: {
      ...state.plugins,
      byIdentifier: {
        ...pickBy(
          state.plugins.byIdentifier,
          (value,key) => key !== action.payload.identifier
        )
      },
      allIdentifiers: filter(
        state.plugins.allIdentifiers, p => p !== action.payload.identifier
      )
    }
  }),

  [importSketchpackRequest]: (state,action) => ({
    ...state,
    isImporting: true
  }),

  [importSketchpackSuccess]: (state,action) => ({
    ...state,
    isImporting: false
  }),

  [importSketchpackError]: (state,action) => ({
    ...state,
    isImporting: false
  })
}, initialState)
