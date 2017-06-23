import { set } from 'lodash'

import { createAction, handleActions } from 'redux-actions'

import { getInstallPath } from 'lib/utils'

//- Actions
//-
export const setPreference = createAction('preference/SET', (payload) => payload, (_,meta) => meta)

//- State

const initialState = {
  syncing: {},
  plugins: {
    install_directory: getInstallPath()
  }
}


//- Reducers

export default handleActions({
  [setPreference]: (state, action) => set(
    state,
    action.payload.path,
    action.payload.value
  )
}, initialState)
