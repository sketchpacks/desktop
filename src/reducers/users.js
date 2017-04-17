import { createAction, handleActions } from 'redux-actions'

import {reduce,filter,uniq} from 'lodash'

//- Actions

export const addUser = createAction('ADD_ENTITIES')


//- State

const initialState = {
  byId: {},
  byHandle: {},
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
    byHandle: {
      ...state.byHandle,
      ...reduce(action.payload.entities.users, (result, value, key) => {
        result[action.payload.entities.users[key].handle] = key
        return result
      }, {})
    },
    allIds: uniq(
      state.allIds.concat(
        Object.keys(action.payload.entities.users)
      )
    )
  })
}, initialState)


//- Selectors

export const getUserEntities = state => state.users.byId
