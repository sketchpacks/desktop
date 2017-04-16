import { createAction, handleActions } from 'redux-actions'


//- Actions

export const addUser = createAction('ADD_ENTITIES')


//- State

const initialState = {
  byId: {},
  allIds: []
}


//- Reducers

export default handleActions({
  [addUser]: (state, action) => ({
    ...state,
    byId: {
      ...state.byId,
      ...action.payload.entities.users
    },
    allIds: state.allIds.concat(action.payload.result)
  })
}, initialState)


//- Selectors

export const getUserEntities = state => state.users.byId
