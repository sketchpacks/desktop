import { createAction, handleActions } from 'redux-actions'

import {reduce} from 'lodash'

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
    byHandle: reduce(action.payload.entities.users, (result, value, key) => {
      result[action.payload.entities.users[key].handle] = key
      return result
    }, {}),
    allIds: state.allIds.concat(action.payload.result)
  })
}, initialState)


//- Selectors

export const getUserEntities = state => state.users.byId
