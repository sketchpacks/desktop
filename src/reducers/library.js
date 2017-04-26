import { ipcRenderer } from 'electron'

import { createAction, handleActions } from 'redux-actions'
import { pick,pickBy,filter } from 'lodash'

//- Actions

export const installPlugin = createAction('manager/INSTALL_SUCCESS')
export const detectPlugin = createAction('library/FETCH_RECEIVED')
export const identifyPlugin = createAction('library/IDENTIFY_PLUGIN_SUCCESS')

export const removePlugin = createAction('library/UNINSTALL_PLUGIN', plugin => {
  ipcRenderer.send('manager/UNINSTALL_REQUEST', plugin)
  return plugin
})


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

  [detectPlugin]: (state, action) => ({
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
  }),

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
