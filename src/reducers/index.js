import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as actions from 'actions'

import {sanitizeSemVer} from 'lib/utils'

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

import {
  SYNC_FILE_RECEIVED,
  SYNC_CHANGE_RECEIVED
} from 'actions/sketchpack'

import {filter,findIndex,uniq} from 'lodash'

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

//
// PLUGINS
//

const initialEntityState = {
  isLoading: false,
  byIdentifier: {},
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

function plugins (state = initialEntityState, action) {
  switch (action.type) {
    case actions.FETCH_CATALOG_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case 'ADD_ENTITIES':
      return {
        ...state,

        byIdentifier: {
          ...state.byIdentifier,
          ...action.payload.entities.plugins
        },
        allIdentifiers: state.allIdentifiers.concat(action.payload.result)
      }

    case actions.FETCH_CATALOG_RECEIVED:
      return {
        ...state,
        isLoading: false,
        allIdentifiers: action.append
          ? state.allIdentifiers
          : []
      }

    case actions.CATALOG_PAGINATE:
      return {
        ...state,
        meta: {
          nextPage: action.payload.pageMeta.next.page || "1",
          sortKey: action.payload.pageMeta.next.sort.split(':')[0],
          sortDir: action.payload.pageMeta.next.sort.split(':')[1],
          sort: action.payload.pageMeta.next.sort
        }
      }

    default:
      return state
  }
}


//
// USERS
//

function users (state = {}, action) {
  switch (action.type) {
    case 'ADD_ENTITIES':
      return {
        ...state,
        ...action.payload.entities.users
      }

    default:
      return state
  }
}

function catalog (state = initialListState, action) {
  switch (action.type) {
    case actions.FETCH_CATALOG_REQUEST:
      return state

    case actions.FETCH_SEARCH_REQUEST:
      return {
        ...state,
        items: [],
        keyword: action.payload.keyword,
        isLoading: true
      }

    case actions.FETCH_CATALOG_RECEIVED:
      return state

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

const initialLibraryState = {
  byIdentifier: {}
}

function library (state = initialLibraryState, action) {
  switch (action.type) {
    case 'ADD_ENTITIES':
      return state

    case INSTALL_PLUGIN_SUCCESS:
      return {
        ...state,
        byIdentifier: {
          ...state.byIdentifier,
          [action.plugin.identifier]: {
            install_path: action.plugin.install_path
          }
        }
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

const initialSketchpackState = {
  isLocked: false,
  isEnabled: false,
  isSyncing: false,
  items: [],
  files: []
}

function sketchpack ( state = initialSketchpackState, action ) {
  switch(action.type) {
    case SYNC_CHANGE_RECEIVED:
      return {
        ...state,
        items: action.payload
      }

    case SYNC_FILE_RECEIVED:
      return {
        ...state,
        files: state.files.concat(action.payload)
      }

    case TOGGLE_VERSION_LOCK_SUCCESS:
      let lockablePluginIndex = findIndex(state.items, (o) => {
        return o.name === action.plugin.name
          && o.owner === action.plugin.owner.handle
      })
      let lockablePlugin = state.items[lockablePluginIndex]

      const newVersion = lockablePlugin.version.indexOf('^') > -1
        ? `${lockablePlugin.version.slice(1)}`
        : `^${lockablePlugin.version}`

      return {
        ...state,
        items: update(state.items, {
          [lockablePluginIndex]: {
            version: {
              $set: newVersion
            },
            version_range: {
              $set: semver.toComparators(newVersion)[0]
            },
            compatible_version: {
              $set: lockablePlugin.compatible_version
            },
            compatible_version_range: {
              $set: semver.toComparators(lockablePlugin.compatible_version)[0]
            }
          }
        })
      }

    default:
      return state
  }
}


const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  pluginDetails,
  app,
  authorDetails,
  authorPlugins,
  sketchpack,


  plugins,
  users
})

export default rootReducer
