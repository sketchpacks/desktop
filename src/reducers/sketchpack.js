import { createAction, handleActions } from 'redux-actions'

import {uniq,includes,isObject,has,pickBy,filter} from 'lodash'

import {
  sanitizeSemVer,
  isSemverLocked,
  lockSemver,
  toggleSemverLock
} from 'lib/utils'

import semver from 'semver'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import {
  detectPlugin,
  identifyPlugin,
  removePlugin
} from 'reducers/library'



//- Actions

export const syncSketchpackRequest = createAction('sketchpack/SYNC_REQUEST')
export const syncSketchpackSuccess = createAction('sketchpack/SYNC_SUCCESS')
export const syncSketchpackError = createAction('sketchpack/SYNC_ERROR')

export const setVersionRange = createAction('sketchpack/SET_VERSION_RANGE')

export const importSketchpackRequest = createAction('sketchpack/IMPORT_REQUEST')
export const importSketchpackSuccess = createAction('sketchpack/IMPORT_SUCCESS')
export const importSketchpackError = createAction('sketchpack/IMPORT_ERROR')

export const exportSketchpackRequest = createAction('sketchpack/EXPORT_REQUEST')
export const exportSketchpackSuccess = createAction('sketchpack/EXPORT_SUCCESS')
export const exportSketchpackError = createAction('sketchpack/EXPORT_ERROR')

export const getPatchLevelLock = (version) => {
  const cleanSemVer = sanitizeSemVer(version)

  return (semver.major(cleanSemVer) === 0)
    ? `^${semver.major(cleanSemVer)}.${semver.minor(cleanSemVer)}`
    : `~${cleanSemVer}`
}

export const getMinorLevelLock = (version) => {
  const cleanSemVer = sanitizeSemVer(version)

  return (semver.major(cleanSemVer) === 0)
    ? `^${semver.major(cleanSemVer)}`
    : `^${cleanSemVer}`
}

export const getFullLevelLock = (version) => `=${version}`
export const getUnlockedLevelLock = (version) => `>=${version}`

const updateVersionLock = (version, strength) => {
  switch(strength) {
    case 'full':
      return getFullLevelLock(version)
    case 'patch':
      return getPatchLevelLock(version)
    case 'minor':
      return getMinorLevelLock(version)
    case 'unlocked':
      return getUnlockedLevelLock(version)
    default:
      return getFullLevelLock(version)
  }
}


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
            version: updateVersionLock(version,lock_strength)
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
            version: lockSemver(plugin.version)
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
  })
}, initialState)
