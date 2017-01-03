import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as actions from 'actions'

import jwt from 'jwt-simple'

const initialListState = {
  items: [],
  isLoading: false,
  nextPage: 1,
  lastPage: 1
}

function auth (state, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      const decoded = jwt.decode(action.token, '', true, 'HS256')
      return {
        ...state,
        token: action.token,
        handle: decoded.user.handle,
        userId: decoded.user.id
      }

    case actions.LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        handle: null,
        userId: null
      }

    default:
      return {
        ...state
      }
  }
}

function plugins (state = initialListState, action) {
  switch (action.type) {
    case actions.PLUGINS_REQUEST:
      return {
        ...state,
        items: [],
        isLoading: true
      }

    case actions.PLUGINS_RECEIVED:
      return {
        ...state,
        items: action.payload,
        isLoading: false
      }

    case actions.PLUGINS_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case actions.PLUGINS_PAGINATE:
      const defaults = {
        firstPage: 1,
        lastPage: 1,
        nextPage: 1,
        prevPage: 1
      }

      const pageInfo = {...defaults}

      if ('payload' in action) {
        const { payload } = action
        pageInfo.firstPage = ('first' in payload) ? payload.first.page : 1,
        pageInfo.lastPage = ('last' in payload) ? payload.last.page : 1
        pageInfo.nextPage = ('next' in payload) ? payload.next.page : 1
        pageInfo.prevPage = ('prev' in payload) ? payload.prev.page : 1
      }
      else {
        return {
          ...state,
          ...defaults
        }
      }

      return {
        ...state,
        ...pageInfo
      }

    default:
      return state
  }
}

function recommends (state = initialListState, action) {
  switch (action.type) {
    case actions.RECOMMENDS_REQUEST:
      return {
        ...state,
        items: [],
        isLoading: true
      }

    case actions.RECOMMENDS_RECEIVED:
      return {
        ...state,
        items: action.payload,
        isLoading: false
      }

    case actions.RECOMMENDS_ERROR:
      return {
        ...state,
        isLoading: false
      }

    default:
      return state
  }
}

function pluginDetails (state, action) {
  switch (action.type) {
    case actions.PLUGIN_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case actions.PLUGIN_DETAILS_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case actions.PLUGIN_DETAILS_RECEIVED:
      return {
        ...state,
        ...action.payload
      }

    case actions.PLUGIN_README_RECEIVED:
      return {
        ...state,
        isLoading: false,
        readme: action.payload
      }

    default:
      return {
        ...state,
        isLoading: false,
        readme: "<em>Loading...</em>"
      }
  }
}

function app (state, action) {
  switch (action.type) {
    case actions.LOCATION_CHANGE:
      return {
        ...state,
        location: action.payload.pathname
      }
    default:
      if (state === undefined) {
        return {
          ...state,
          location: '/browse'
        }
      }
      else {
        return state
      }
  }
}

function authorDetails (state, action) {
  switch (action.type) {
    case actions.AUTHOR_PROFILE_RECEIVED:
      return {
        ...state,
        name: action.payload.name,
        handle: action.payload.handle,
        email: action.payload.email,
        avatar_url: action.payload.avatar_url
      }
    default:
      if (state === undefined) {
        return {
          ...state,
          name: null,
          handle: null,
          email: null,
          avatar_url: null,
        }
      }
      else {
        return state
      }
  }
}

const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  plugins,
  pluginDetails,
  recommends,
  app,
  authorDetails
})

export default rootReducer