import path from 'path'
import { set } from 'lodash'

import electron from 'electron'

import { createAction, handleActions } from 'redux-actions'

import readSketchpack from 'lib/readSketchpack'
import { getInstallPath } from 'lib/utils'

import {
  syncSketchpackRequest,
  importSketchpackRequest
} from 'reducers/sketchpack'

//- Actions

export const setPreferenceRequest = createAction('preferences/UPDATE_REQUEST')
export const setPreferenceSuccess = createAction('preferences/UPDATE_SUCCESS', (payload) => payload, (_,meta) => meta)
export const setPreferenceError = createAction('preferences/UPDATE_ERROR')

export const setPreference = ({ path, value }) => (dispatch,getState) => {
  dispatch(setPreferenceRequest({ path, value }))

  if (path === 'syncing.sketchpack_path') {
    readSketchpack(value)
      .then(contents => {
        dispatch(syncSketchpackRequest(contents))
        // dispatch(importSketchpackRequest(contents))
      })
  }

  dispatch(setPreferenceSuccess({ path, value }))
}

//- State

const defaultSketchpack = path.join(
  (electron.app || electron.remote.app).getPath('userData'),
  'my-library.sketchpack'
)

export const initialState = {
  syncing: {
    sketchpack_path: defaultSketchpack
  },
  plugins: {
    install_directory: getInstallPath()
  }
}


//- Reducers

export default handleActions({
  [setPreferenceRequest]: (state, action) => ({
    ...state,
    ...set(state, action.payload.path, action.payload.value)
  })
}, initialState)
