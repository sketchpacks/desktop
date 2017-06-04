import { createAction, handleActions } from 'redux-actions'

import {reduce,filter,uniq} from 'lodash'

import { searchSuccess } from 'reducers/search'

import { identifyPlugin } from 'reducers/library'

//- Actions

export const addUser = createAction('ADD_ENTITIES')

export const browseSuccess = createAction('browse/FETCH_SUCCESS')

//- State

const initialState = {
  byId: {},
  byHandle: {},
  allIds: []
}


//- Reducers

export default handleActions({
  [identifyPlugin]: (state, action) => ({
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
  }),

  [searchSuccess]: (state, action) => ({
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
  }),

  [browseSuccess]: (state, action) => ({
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
