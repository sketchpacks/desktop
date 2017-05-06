import { createAction, handleActions } from 'redux-actions'

import { without } from 'lodash'

import {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,
  installPlugin,
  detectPlugin
} from 'reducers/library'

//- State

const initialState = {
  installing: []
}


//- Reducers

export default handleActions({
  // Add reference to identifier before install
  [installPluginRequest]: (state, action) => {
    return {
      ...state,
      installing: state.installing.concat(action.payload)
    }
  },

  // Remove reference to identifier after install
  [detectPlugin]: (state, action) => {
    return {
      ...state,
      installing: without(state.installing, action.payload.result)
    }
  },

  // Remove reference to identifier after failed install
  [installPluginError]: (state, action) => {
    return {
      ...state,
      installing: without(state.installing, action.meta.plugin.identifier)
    }
  }
}, initialState)
