import { ipcRenderer } from 'electron'

import { createAction, handleActions } from 'redux-actions'
import { pick,pickBy,filter } from 'lodash'

//- Actions

export const installPlugin = createAction('manager/INSTALL_SUCCESS')
export const detectPlugin = createAction('library/FETCH_RECEIVED', (payload) => payload, (_,meta) => meta)
export const identifyPlugin = createAction('library/IDENTIFY_PLUGIN_SUCCESS', (payload) => payload, (_,meta) => meta)

export const removePlugin = createAction('library/UNINSTALL_PLUGIN', identifier => {
  ipcRenderer.send('manager/UNINSTALL_REQUEST', identifier)
  return identifier
})

export const updatePlugin = createAction('library/UPDATE_PLUGIN', identifier => {
  ipcRenderer.send('manager/UPDATE_REQUEST', identifier)
  return identifier
})

export const installPluginRequest = createAction('library/INSTALL_PLUGIN_REQUEST', (payload) => payload, (_,meta) => meta)
export const installPluginSuccess = createAction('library/INSTALL_PLUGIN_SUCCESS', (payload) => payload, (_,meta) => meta)
export const installPluginError = createAction('manager/INSTALL_ERROR')

export const uninstallPluginRequest = createAction('library/UNINSTALL_PLUGIN_REQUEST')
export const uninstallPluginSuccess = createAction('library/UNINSTALL_PLUGIN_SUCCESS', (payload) => payload, (_,meta) => meta)
export const uninstallPluginError = createAction('library/UNINSTALL_PLUGIN_ERROR')

export const updatePluginRequest = createAction('library/UPDATE_PLUGIN_REQUEST')
export const updatePluginSuccess = createAction('library/UPDATE_PLUGIN_SUCCESS', (payload) => payload, (_,meta) => meta)
export const updatePluginError = createAction('library/UPDATE_PLUGIN_ERROR')


//- State

const initialState = {
  plugins: {
    byIdentifier: {},
    allIdentifiers: []
  }
}


//- Reducers

export default handleActions({
  [installPlugin]: (state, action) => ({
    ...state,
    plugins: {
      ...state.plugins,
      byIdentifier: {
        ...state.plugins.byIdentifier,
        [action.plugin.identifier]: {
          install_path: action.plugin.install_path
        }
      }
    }
  }),

  [detectPlugin]: (state, action) => {
    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [action.payload.result]: pick(
            action.payload.entities.plugins[action.payload.result],
            ['install_path', 'manifest_path', 'version', 'compatible_version']
          )
        },
        allIdentifiers: state.plugins.allIdentifiers.concat(action.payload.result)
      }
    }
  },

  [identifyPlugin]: (state, action) => {
    return {
      ...state,
      plugins: {
        ...state.plugins,
        byIdentifier: {
          ...state.plugins.byIdentifier,
          [action.payload.result]: pick(
            action.payload.entities.plugins[action.payload.result],
            ['install_path', 'manifest_path', 'version', 'compatible_version']
          )
        },
        allIdentifiers: state.plugins.allIdentifiers.concat(action.payload.result)
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

  [installPluginError]: (state, action) => {
    console.log(action)
    return state
  }
}, initialState)
