import { API_URL } from 'config'
import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import qs from 'qs'
import linkHeader from 'parse-link-header'
import { normalize } from 'normalizr'
import * as schemas from 'schemas'
import { createSelector } from 'reselect'
import { reduce } from 'lodash'

const DEFAULT_TIMEOUT = 1500


//- Actions

export const changeLocation = createAction('@@router/LOCATION_CHANGE')
export const addPlugin = createAction('ADD_ENTITIES')
export const browseRequest = createAction('browse/FETCH_REQUEST')
export const browseSuccess = createAction('browse/FETCH_SUCCESS')
export const browseError = createAction('browse/FETCH_ERROR')
export const catalogRequest = createAction('catalog/FETCH_REQUEST')
export const catalogReceived = createAction('catalog/FETCH_RECEIVED')
export const catalogPaginate = createAction('catalog/PAGINATE')

export const browsePlugins = ({ url, list, append}) => (dispatch,getState) => {
  const client = axios.create({
    baseURL: `${API_URL}/v1`,
    timeout: DEFAULT_TIMEOUT,
    transformResponse: (data) => normalize(JSON.parse(data), schemas.pluginListSchema)
  })

  dispatch(browseRequest({ list }))

  client.get(url)
    .then(
      data => {
        // data.data => { entities, result }
        // data.headers => link, per_page, total
        // data.status => 200 OK

        if (data.status === 200) {
          dispatch(addPlugin(data.data))
          dispatch(
            browseSuccess({
              ...data.data,
              append,
              list,
              pagination: linkHeader(data.headers.link)
            })
          )
        }
      },
      err => dispatch(browseError(err))
    )
}


//- State

const initialState = {
  isLoading: false,
  isError: false,
  byIdentifier: {},
  allIdentifiers: [],
  meta: {
    prevPage: "1",
    page: "1",
    nextPage: "1",
    sort: "score:desc",
    q: ""
  }
}


//- Reducers

export default handleActions({
  [addPlugin]: (state, action) => {
    return {
      ...state,
      byIdentifier: {
        ...state.byIdentifier,
        ...action.payload.entities.plugins
      }
    }
  },

  [browseError]: (state, action) => ({
    ...state,
    isLoading: false,
    isError: true,
    errorMessage: action.payload.message
  }),

  [browseRequest]: (state, action) => ({
    ...state,
    isLoading: true
  }),

  [browseSuccess]: (state, action) => ({
    ...state,
    isLoading: false,
    isError: false,
    errorMessage: null,
    byIdentifier: {
      ...state.byIdentifier,
      ...action.payload.entities.plugins
    },
    allIdentifiers: action.payload.append
      ? state.allIdentifiers.concat(action.payload.result)
      : action.payload.result,
    meta: {
      ...state.meta,
      nextPage: action.payload.pagination.next.page || state.meta.nextPage,
      sort: action.payload.pagination.next.sort || state.meta.sort
    }
  }),

  [changeLocation]: (state,action) => {
    return {
      ...state,
      meta: {
        ...state.meta,
        page: action.payload.query.page,
        sort: action.payload.query.sort,
      }
    }
  }
}, initialState)
