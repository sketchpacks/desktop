import { createAction, handleActions } from 'redux-actions'


//- Actions

export const addUser = createAction('ADD_ENTITIES')


//- State

const initialState = {}


//- Reducers

export default handleActions({
  [addUser]: (state, action) => ({
    ...state,
    ...action.payload.entities.users
  })
}, initialState)


//- Selectors
