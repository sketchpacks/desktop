import path from 'path'
import electron from 'electron'
import { set } from 'lodash'

import { createAction, handleActions } from 'redux-actions'

import { getInstallPath } from 'lib/utils'

//- Actions

export const setPreferenceRequest = createAction('preferences/UPDATE_REQUEST')
export const setPreferenceSuccess = createAction('preferences/UPDATE_SUCCESS', (payload) => payload, (_,meta) => meta)
export const setPreferenceError = createAction('preferences/UPDATE_ERROR')

export const setPreference = ({ path, value }) => (dispatch,getState) => {
  dispatch(setPreferenceRequest({ path, value }))

  dispatch(setPreferenceSuccess())
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
