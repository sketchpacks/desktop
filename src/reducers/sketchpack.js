import { createAction, handleActions } from 'redux-actions'

import {uniq,includes,isObject,has,pickBy,filter,reduce} from 'lodash'

import { sanitizeSemVer } from 'lib/utils'

import semver from 'semver'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import {
  detectPlugin,
  identifyPlugin,
  removePlugin,
  installPluginRequest
} from 'reducers/library'

import {
  setPreferenceRequest,
  setPreferenceSuccess,
  loadPreferences
} from 'reducers/preferences'

import { setVersionLock } from 'lib/VersionLock'



//- Actions

export const syncSketchpackRequest = createAction('sketchpack/SYNC_REQUEST')
export const syncSketchpackSuccess = createAction('sketchpack/SYNC_SUCCESS', (payload) => payload, (_,meta) => meta)
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
  isLoaded: false,
  defaultLock: 'locked',
  name: 'My Library',
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
        allIdentifiers: uniq(Object.keys(action.payload.plugins))
      }
    }
  },

  [syncSketchpackSuccess]: (state, action) => {
    return {
      ...state,
      isLoaded: true
    }
  },

  [setPreferenceSuccess]: (state, action) => {
    if (!has(action, 'payload.path')) return state

    return {
      ...state,
      isLoaded: action.payload.path === 'sketchpack.location'
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

  [identifyPlugin]: (state, action) => {
    let { entities, result } = action.payload

    const plugins = action.payload.result.filter(
      identifier => {
        return !has(entities[identifier], 'owner')
      }
    )

    if (plugins.length === 0) return state

    if (state.isLocked) return state

    return {
      ...state,
      isLoaded: true,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          ...reduce(entities.plugins, (result, data, identifier) => {
            result[identifier] = {
              version: has(state.plugins.byIdentifier, identifier)
                ? state.plugins.byIdentifier[identifier].version
                : setVersionLock({
                    semver: data.version,
                    lock: state.defaultLock
                  })
            }
            return result
          }, {})
        },
        allIdentifiers: uniq(
          state.plugins.allIdentifiers.concat(action.payload.result)
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

  [installPluginRequest]: (state,action) => {
    if (has(action,'meta.import')) {
      return {
        ...state,
        isImporting: action.meta.import
      }
    } else {
      return state
    }
  },

  [importSketchpackSuccess]: (state,action) => ({
    ...state,
    isImporting: false,
    isLoaded: true
  }),

  [importSketchpackError]: (state,action) => ({
    ...state,
    isImporting: false
  }),

  [loadPreferences]: (state,action) => ({
    ...state,
    defaultLock: action.payload.sketchpack.defaultLock
  }),

  [setPreferenceRequest]: (state,action) => {
    if (action.payload.path === "sketchpack.defaultLock") {
      return {
        ...state,
        defaultLock: action.payload.value
      }
    } else {
      return state
    }
  }
}, initialState)
