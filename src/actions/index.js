export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'

export function loginRequest () {
  return {
    type: LOGIN_REQUEST
  }
}


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export function loginSuccess (jwt) {
  return {
    type: LOGIN_SUCCESS,
    token: jwt
  }
}


export const LOGIN_FAIL = 'LOGIN_FAIL'

export function loginFail () {
  return {
    type: LOGIN_FAIL
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export function logoutSuccess () {
  return {
    type: LOGOUT_SUCCESS
  }
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'

export function logoutRequest () {
  return (dispatch, getState) => {
    dispatch(logoutSuccess())
  }
}

export const PLUGINS_ERROR = 'PLUGINS_ERROR'

export function pluginsError () {
  return {
    type: PLUGINS_ERROR
  }
}


export const PLUGINS_REQUEST = 'PLUGINS_REQUEST'

export function pluginsRequest () {
  return {
    type: PLUGINS_REQUEST
  }
}


export const PLUGINS_RECEIVED = 'PLUGINS_RECEIVED'

export function pluginsReceived (payload) {
  return {
    type: PLUGINS_RECEIVED,
    payload: payload
  }
}


export const PLUGINS_PAGINATE = 'PLUGINS_PAGINATE'

export function pluginsPaginate (payload) {
  return {
    type: PLUGINS_PAGINATE,
    payload: payload
  }
}


export const PLUGIN_DETAILS_REQUEST = 'PLUGIN_DETAILS_REQUEST'

export function pluginDetailsRequest () {
  return {
    type: PLUGIN_DETAILS_REQUEST
  }
}

export const PLUGIN_DETAILS_ERROR = 'PLUGIN_DETAILS_ERROR'

export function pluginDetailsError () {
  return {
    type: PLUGIN_DETAILS_ERROR
  }
}


export const PLUGIN_DETAILS_RECEIVED = 'PLUGIN_DETAILS_RECEIVED'

export function pluginDetailsReceived (payload) {
  return {
    type: PLUGIN_DETAILS_RECEIVED,
    payload: payload
  }
}


export const PLUGIN_README_REQUEST = 'PLUGIN_README_REQUEST'

export function pluginReadmeRequest () {
  return {
    type: PLUGIN_README_REQUEST
  }
}


export const PLUGIN_README_RECEIVED = 'PLUGIN_README_RECEIVED'

export function pluginReadmeReceived (payload) {
  return {
    type: PLUGIN_README_RECEIVED,
    payload: payload
  }
}


export const RECOMMENDS_REQUEST = 'RECOMMENDS_REQUEST'

export function recommendsRequest () {
  return {
    type: RECOMMENDS_REQUEST
  }
}

export const RECOMMENDS_ERROR = 'RECOMMENDS_ERROR'

export function recommendsError () {
  return {
    type: RECOMMENDS_ERROR
  }
}


export const RECOMMENDS_RECEIVED = 'RECOMMENDS_RECEIVED'

export function recommendsReceived (payload) {
  return {
    type: RECOMMENDS_RECEIVED,
    payload: payload
  }
}


export const AUTHOR_PROFILE_REQUEST = 'author/PROFILE_REQUEST'

export function authorProfileRequest () {
  return {
    type: AUTHOR_PROFILE_REQUEST
  }
}

export const AUTHOR_PROFILE_RECEIVED = 'author/PROFILE_RECEIVED'

export function authorProfileReceived (payload) {
  return {
    type: AUTHOR_PROFILE_RECEIVED,
    payload
  }
}


export const SEARCH = 'plugins/SEARCH'

export function search (payload) {
  return {
    type: SEARCH,
    payload
  }
}

export const SEARCH_RESULTS_RECEIVED = 'plugins/SEARCH_RESULTS_RECEIVED'

export function searchResultsReceived (payload) {
  return {
    type: SEARCH_RESULTS_RECEIVED,
    payload: payload
  }
}
