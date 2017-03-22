import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as actions from 'actions'

import sanitizeSemVer from 'lib/utils'

import semver from 'semver'
import update from 'immutability-helper'

import {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  updatePluginRequest,
  updatePluginSuccess,
  updatePluginError,
  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_ERROR,

  uninstallPluginSuccess,
  uninstallPluginError,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR,

  toggleVersionLockRequest,
  toggleVersionLockSuccess,
  TOGGLE_VERSION_LOCK_REQUEST,
  TOGGLE_VERSION_LOCK_SUCCESS
} from 'actions/plugin_manager'

import {filter,findIndex} from 'lodash'

const initialListState = {
  items: [],
  isLoading: false,
  nextPage: 1,
  lastPage: 1,
  sort: 'score:desc',
  total: 0,
}


const updateObjectInArray = (array, action) => {
  return array.map(plugin => (plugin.id !== action.plugin.id)
    ? plugin
    : { ...plugin, ...action.plugin }
  )
}

const removeObjectFromArray = (array, action) => {
  return filter(array, (plugin) => plugin.id !== action.plugin.id)
}

function catalog (state = initialListState, action) {
  switch (action.type) {
    case actions.FETCH_CATALOG_REQUEST:
      return {
        ...state,
        isLoading: true,
        items: action.append ? state.items : [],
      }

    case actions.FETCH_SEARCH_REQUEST:
      return {
        ...state,
        items: [],
        keyword: action.payload.keyword,
        isLoading: true
      }

    case actions.FETCH_CATALOG_RECEIVED:
      return {
        ...state,
        isLoading: false,
        items: action.append ? state.items.concat(action.payload) : action.payload,
        total: action.total,
      }

    case actions.FETCH_CATALOG_ERROR:
      return {
        ...state,
        isLoading: false,
      }

    case actions.CATALOG_SORT_BY:
      return {
        ...state,
        sort: action.sort,
      }

    case actions.CATALOG_PAGINATE:
      const defaults = {
        firstPage: 1,
        lastPage: 1,
        nextPage: 1,
        prevPage: 1,
        total: 0,
      }

      const pageInfo = {...defaults}

      if ('payload' in action) {
        const { payload } = action
        pageInfo.firstPage = ('first' in payload) ? payload.first.page : 1
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

    case UNINSTALL_PLUGIN_SUCCESS:
      return {
        ...state,
        items: updateObjectInArray(state.items, action)
      }

    case INSTALL_PLUGIN_SUCCESS:
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

    case TOGGLE_VERSION_LOCK_SUCCESS:
      const newVersion = (action.plugin.version.indexOf('^') > -1)
        ? `${action.plugin.version.slice(1)}`
        : `^${action.plugin.version}`

      return {
        ...state,
        items: update(state.items, {
          [findIndex(state.items, ['id', action.plugin.id])]: {
            version: { $set: newVersion }
          }
        })
      }

    case 'manager/UPDATE_SUCCESS':
      return {
        ...state,
        items: update(state.items, {
          [findIndex(state.items, ['id', action.plugin.id])]: {
            install_path: { $set: action.plugin.install_path },
            version: { $set: `^${action.plugin.version}` }
          }
        })
      }

    case 'manager/UNINSTALL_SUCCESS':
      return {
        ...state,
        items: removeObjectFromArray(state.items, action)
      }

    case 'manager/INSTALL_SUCCESS':
      return {
        ...state,
        items: (findIndex(state.items, (p) => {
          return p.owner.handle === action.plugin.owner.handle && p.name === action.plugin.name
        }) === -1)
          ? state.items.concat(action.plugin)
          : updateObjectInArray(state.items, action)
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
        isLoading: false,
        ...action.payload,
      }

    case actions.PLUGIN_README_RECEIVED:
      return {
        ...state,
        isLoading: false,
        readme: action.payload,
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
    case actions.FETCH_USER_RECEIVED:
      return {
        ...state,
        name: action.payload.name,
        handle: action.payload.handle,
        email: action.payload.email,
        avatar_url: action.payload.avatar_url,
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

function authorPlugins (state = initialListState, action) {
  switch (action.type) {
    case actions.FETCH_USER_PLUGINS_REQUEST:
      return {
        ...state,
        isLoading: true,
        items: action.append ? state.items : []
      }

    case actions.FETCH_USER_PLUGINS_RECEIVED:
      return {
        ...state,
        items: action.append ? state.items.concat(action.payload) : action.payload,
        isLoading: false
      }

    case actions.FETCH_USER_PLUGINS_ERROR:
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


const rootReducer = combineReducers({
  routing: routerReducer,
  catalog,
  library,
  pluginDetails,
  app,
  authorDetails,
  authorPlugins,
})

export default rootReducer
