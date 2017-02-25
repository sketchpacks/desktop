import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as actions from 'actions'

const initialListState = {
  items: [],
  isLoading: false,
  nextPage: 1,
  lastPage: 1,
  sort_by: 'score:desc',
}


const updateObjectInArray = (array, action) => {
  return array.map(plugin => (plugin.id !== action.plugin.id)
    ? plugin
    : { ...plugin, ...action.plugin }
  )
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

    case actions.PLUGINS_FETCH_RECEIVED:
      return {
        ...state,
        items: state.items.concat(action.payload),
        isLoading: false
      }

    case 'manager/UNINSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case 'manager/INSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case actions.PLUGINS_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case actions.PLUGINS_SORT_BY:
      return {
        ...state,
        sort_by: action.sort
      }

    case actions.PLUGINS_PAGINATE:
      const defaults = {
        firstPage: 1,
        lastPage: 1,
        nextPage: 1,
        prevPage: 1,
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

function catalog (state = initialListState, action) {
  switch (action.type) {
    case actions.FETCH_CATALOG_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case actions.FETCH_CATALOG_RECEIVED:
      return {
        ...state,
        items: (action.append) ? state.items.concat(action.payload) : action.payload,
        isLoading: false
      }

    case actions.FETCH_CATALOG_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case actions.CATALOG_SORT_BY:
      return {
        ...state,
        sort_by: action.sort
      }

    case actions.CATALOG_PAGINATE:
      const defaults = {
        firstPage: 1,
        lastPage: 1,
        nextPage: 1,
        prevPage: 1,
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

    case 'manager/UNINSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case 'manager/INSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    default:
      return state
  }
}

function library (state = initialListState, action) {
  switch (action.type) {
    case actions.FETCH_LIBRARY_REQUEST:
      return {
        ...state,
        items: [],
        isLoading: true
      }

    case actions.FETCH_LIBRARY_RECEIVED:
      return {
        ...state,
        items: action.payload,
        isLoading: false
      }

    case actions.FETCH_LIBRARY_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case 'manager/UNINSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case 'manager/INSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
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
        isLoading: true,
        readme: "<em>Loading...</em>",
        id: "",
        name: "",
        title: "",
        description: "",
        version: "0.0.0",
        compatible_version: "0.0.0",
        source_url: "",
        download_url: "",
        score: 0.0,
        watchers_count: 0,
        stargazers_count: 0,
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
        ...state
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
          location: '/browse/popular'
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


function search (state = {...initialListState, keyword: ''}, action) {
  switch (action.type) {
    case actions.FETCH_SEARCH_REQUEST:
      return {
        ...state,
        items: [],
        keyword: action.payload,
        isLoading: true
      }

    case actions.FETCH_SEARCH_RECEIVED:
      return {
        ...state,
        items: state.items.concat(action.payload),
        isLoading: false
      }

    case actions.FETCH_SEARCH_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case 'manager/UNINSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case 'manager/INSTALL_SUCCESS':
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    default:
      if (typeof state === undefined) {
        return {
          ...state,
          keyword: '',
          items: []
        }
      }
      else {
        return state
      }
  }
}

const rootReducer = combineReducers({
  routing: routerReducer,
  plugins,
  catalog,
  library,
  pluginDetails,
  app,
  authorDetails,
  search,
})

export default rootReducer
