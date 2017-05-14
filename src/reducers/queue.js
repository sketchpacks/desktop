import { createAction, handleActions } from 'redux-actions'

import { without,uniq } from 'lodash'

import {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,
  installPlugin,
  detectPlugin
} from 'reducers/library'

import {
  importSketchpackRequest
} from 'reducers/sketchpack'

//- State

const initialState = {
  installing: []
}


//- Reducers

export default handleActions({
  ['sketchpack/IMPORT_REQUEST']: (state, action) => {
    return {
      ...state,
      installing: uniq(state.installing.concat(Object.keys(action.payload.plugins)))
    }
  },

  // Add reference to identifier before install
  [installPluginRequest]: (state, action) => {
    return {
      ...state,
      installing: uniq(state.installing.concat(action.payload))
    }
  },

  // Remove reference to identifier after install
  [installPluginSuccess]: (state, action) => {
    return {
      ...state,
      installing: without(state.installing, action.payload)
    }
  },

  // Remove reference to identifier after being detected
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
      installing: without(state.installing, action.meta.plugin)
    }
  }
}, initialState)
