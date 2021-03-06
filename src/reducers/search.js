import { API_URL, REQUEST_TIMEOUT, REQUEST_PER_PAGE } from 'config'
import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import qs from 'qs'
import linkHeader from 'parse-link-header'
import { normalize } from 'normalizr'
import * as schemas from 'schemas'
import { addPlugin } from 'reducers/plugins'


//- Actions

export const searchRequest = createAction('search/FETCH_REQUEST', (payload) => payload, (_,meta) => meta)
export const searchSuccess = createAction('search/FETCH_SUCCESS')
export const searchError = createAction('search/FETCH_ERROR')

export const searchPlugins = ({ url, list, append, keyword }) => (dispatch,getState) => {
  const client = axios.create({
    baseURL: `${API_URL}/v1`,
    timeout: REQUEST_TIMEOUT,
    headers: {'Content-Encoding': 'gzip'},
    transformResponse: (data) => normalize(JSON.parse(data), schemas.pluginListSchema)
  })

  const params = {
    per_page: REQUEST_PER_PAGE
  }

  dispatch(
    searchRequest({
      keyword
    }, {
      mixpanel: {
        eventName: 'Registry',
        type: 'Search',
        props: {
          source: 'desktop',
          keyword
        }
      }
    })
  )

  client.get(url, params)
    .then(
      data => {
        // data.data => { entities, result }
        // data.headers => link, per_page, total
        // data.status => 200 OK

        if (data.status === 200) {
          dispatch(addPlugin(data.data))
          dispatch(
            searchSuccess({
              ...data.data,
              append,
              list: 'search',
              pagination: linkHeader(data.headers.link)
            })
          )
        }
      },
      err => dispatch(searchError(err))
    )
}

//- State

const initialState = {
  keyword: "",
  plugins: {
    allIdentifiers: []
  }
}


//- Reducers

export default handleActions({
  [searchRequest]: (state, action) => ({
    ...state,
    keyword: action.payload.keyword
  }),

  [searchSuccess]: (state, action) => {
    return {
      ...state,
      plugins: {
        ...state.plugins,
        allIdentifiers: action.payload.result
      }
    }
  },

  [searchError]: (state, action) => state // TO BE IMPLEMENTED
}, initialState)
