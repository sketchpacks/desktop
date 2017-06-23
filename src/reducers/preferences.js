import { set }

import { createAction, handleActions } from 'redux-actions'

//- Actions
//-
export const setPreference = createAction('preference/SET', (payload) => payload, (_,meta) => meta)

//- State

const initialState = {
  syncing: {}
}


//- Reducers

export default handleActions({
  [setPreference]: (state, action) => set(
    state,
    action.payload.path,
    action.payload.value
  )
}, initialState)
