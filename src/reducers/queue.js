import { createAction, handleActions } from 'redux-actions'

import { without, uniq, isArray } from 'lodash'

import {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,
  updatePlugin,
  updatePluginSuccess,
  updatePluginError,
  installPlugin,
  detectPlugin
} from 'reducers/library'

import {
  importSketchpackRequest
} from 'reducers/sketchpack'

//- State

const initialState = {
  installing: [],
  updating: []
}


//- Reducers

export default handleActions({
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
  },

  // Add reference to identifier before update
  [updatePlugin]: (state, action) => {
    const identifiers = [].concat(action.payload).map(plugin => plugin.identifier)

    return {
      ...state,
      updating: uniq(state.updating.concat(identifiers))
    }
  },

  // Remove reference to identifier after update
  [updatePluginSuccess]: (state, action) => {
    return {
      ...state,
      updating: without(state.updating, action.payload)
    }
  },

  // Remove reference to identifier after failed update
  [updatePluginError]: (state, action) => {
    return {
      ...state,
      updating: without(state.updating, action.meta.plugin)
    }
  }
}, initialState)
