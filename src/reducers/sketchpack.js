import { createAction, handleActions } from 'redux-actions'


//- Actions

export const syncSketchpack = createAction('SYNC_SKETCHPACK')


//- State

const initialState = {
  isLocked: false,
  isEnabled: false,
  isSyncing: false,
  items: [],
  files: []
}


//- Reducers

export default handleActions({
  [syncSketchpack]: (state, action) => ({
    ...state,
    ...action.payload
  })
}, initialState)


//- Selectors

export const getSketchpack = (state) => state
