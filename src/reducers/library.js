import { ipcRenderer } from 'electron'

import { createAction, handleActions } from 'redux-actions'
import { pick,pickBy,filter,uniq } from 'lodash'

//- Actions

export const detectPlugin = createAction('library/PLUGIN_DETECTED', (payload) => payload, (_,meta) => meta)
export const identifyPlugin = createAction('registry/IDENTIFY_PLUGINS_SUCCESS', (payload) => payload, (_,meta) => meta)

export const installPlugin = createAction('library/INSTALL_PLUGIN', identifiers => {
  ipcRenderer.send('manager/INSTALL_REQUEST', identifiers)
  return identifiers
})

export const removePlugin = createAction('library/UNINSTALL_PLUGIN', identifiers => {
  ipcRenderer.send('manager/UNINSTALL_REQUEST', identifiers)
  return identifiers
})

export const updatePlugin = createAction('library/UPDATE_PLUGIN', plugins => {
  ipcRenderer.send('manager/UPDATE_REQUEST', plugins)
  return plugins
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
          [action.payload.plugin.identifier]: {
            ...pick(
              action.payload.plugin,
              ['install_path', 'manifest_path', 'version', 'compatible_version']
            ),
            installed_version: action.payload.plugin.version
          }
        },
        allIdentifiers: uniq(state.plugins.allIdentifiers.concat(action.payload.plugin.identifier))
      }
    }
  },

  [uninstallPluginSuccess]: (state,action) => ({
    ...state,
    plugins: {
      ...state.plugins,
      byIdentifier: {
        ...pickBy(
          state.plugins.byIdentifier,
          (value,key) => key !== action.payload
        )
      },
      allIdentifiers: filter(
        state.plugins.allIdentifiers, p => p !== action.payload
      )
    }
  }),

  [installPluginError]: (state, action) => {
    console.log(action)
    return state
  }
}, initialState)
