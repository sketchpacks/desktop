import { createAction, handleActions } from 'redux-actions'

import { createSelector } from 'reselect'

import {reduce} from 'lodash'


//- Actions

export const addPlugin = createAction('ADD_ENTITIES')
export const catalogRequest = createAction('catalog/FETCH_REQUEST')
export const catalogReceived = createAction('catalog/FETCH_RECEIVED')
export const catalogPaginate = createAction('catalog/PAGINATE')


//- State

const initialState = {
  isLoading: false,
  byIdentifier: {},
  byNamespace: {},
  allIdentifiers: [],
  meta: {
    prevPage: "1",
    currentPage: "1",
    nextPage: "1",
    sort: "score:desc",
    sortKey: "score",
    sortDir: "desc"
  }
}


//- Reducers

export default handleActions({
  [addPlugin]: (state, action) => ({
    ...state,
    byIdentifier: {
      ...state.byIdentifier,
      ...action.payload.entities.plugins
    },
    byNamespace: {
      ...state.byNamespace,
      ...reduce(action.payload.entities.plugins, (result, value, key) => {
        try {
          result[`${action.payload.entities.users[value.owner].handle}/${value.name}`] = key
        } catch (err) {
          return state.byNamespace
        }
        return result
      }, {})
    },
    allIdentifiers: state.allIdentifiers.concat(action.payload.result)
  }),

  [catalogRequest]: (state, action) => ({
    ...state,
    isLoading: true
  }),

  [catalogReceived]: (state, action) => ({
    ...state,
    isLoading: false,
    allIdentifiers: action.append
      ? state.allIdentifiers
      : []
  }),

  [catalogPaginate]: (state, action) => ({
    ...state,
    meta: {
      nextPage: action.payload.pageMeta.next.page || "1",
      sortKey: action.payload.pageMeta.next.sort.split(':')[0],
      sortDir: action.payload.pageMeta.next.sort.split(':')[1],
      sort: action.payload.pageMeta.next.sort
    }
  })
}, initialState)
