import linkHeader from 'parse-link-header'


export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const PLUGINS_SORT_BY = 'plugins/SORT_BY'

export function pluginsSortBy (sort) {
  return {
    type: PLUGINS_SORT_BY,
    sort
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


export const PLUGINS_FETCH_RECEIVED = 'plugins/FETCH_RECEIVED'

export function fetchPluginsReceived (payload) {
  return {
    type: PLUGINS_FETCH_RECEIVED,
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


//
// CATALOG
//

export function fetchCatalog (query, append=true) {
  return (dispatch, getState, {api}) => {
    dispatch(fetchCatalogRequest(query))

    api.getCatalog({query: query})
      .then(response => {
        const pageMeta = linkHeader(response.headers.link)

        if (pageMeta) dispatch(catalogPaginate(pageMeta))

        dispatch(fetchCatalogReceived({
          payload: response.data,
          append: append
        }))
      })
      .catch(error => dispatch(fetchCatalogError(error)))
  }
}

export const FETCH_CATALOG_REQUEST = 'catalog/FETCH_REQUEST'

export function fetchCatalogRequest (payload) {
  return {
    type: FETCH_CATALOG_REQUEST,
    payload
  }
}

export const FETCH_CATALOG_RECEIVED = 'catalog/FETCH_RECEIVED'

export function fetchCatalogReceived ({payload, append}) {
  return {
    type: FETCH_CATALOG_RECEIVED,
    payload: payload,
    append
  }
}

export const FETCH_CATALOG_ERROR = 'catalog/FETCH_ERROR'

export function fetchCatalogError (error) {
  return {
    type: FETCH_CATALOG_ERROR,
    error
  }
}

export const CATALOG_PAGINATE = 'catalog/PAGINATE'

export function catalogPaginate (payload) {
  return {
    type: CATALOG_PAGINATE,
    payload: payload
  }
}

export const CATALOG_SORT_BY = 'catalog/SORT_BY'

export function catalogSortBy (sort) {
  return {
    type: CATALOG_SORT_BY,
    sort
  }
}


//
// SEARCH
//

export function fetchSearch (keyword) {
  return (dispatch, getState, {api}) => {
    dispatch(fetchSearchRequest(keyword))

    api.getCatalog({query: `text=${keyword}`})
      .then(response => {
        const pageMeta = linkHeader(response.headers.link)

        if (pageMeta) dispatch(pluginsPaginate(pageMeta))

        dispatch(fetchSearchReceived(response.data))
      })
      .catch(error => dispatch(fetchSearchError(error)))
  }
}

export const FETCH_SEARCH_REQUEST = 'search/FETCH_REQUEST'

export function fetchSearchRequest (payload) {
  return {
    type: FETCH_SEARCH_REQUEST,
    payload
  }
}

export const FETCH_SEARCH_RECEIVED = 'search/FETCH_RECEIVED'

export function fetchSearchReceived (payload) {
  return {
    type: FETCH_SEARCH_RECEIVED,
    payload: payload
  }
}

export const FETCH_SEARCH_ERROR = 'search/FETCH_ERROR'

export function fetchSearchError (error) {
  return {
    type: FETCH_SEARCH_ERROR,
    error
  }
}


//
// LIBRARY
//

export const FETCH_LIBRARY_REQUEST = 'library/FETCH_REQUEST'

export function fetchLibraryRequest () {
  return {
    type: FETCH_LIBRARY_REQUEST
  }
}


export const FETCH_LIBRARY_RECEIVED = 'library/FETCH_RECEIVED'

export function fetchLibraryReceived (payload) {
  return {
    type: FETCH_LIBRARY_RECEIVED,
    payload: payload
  }
}

export const FETCH_LIBRARY_ERROR = 'library/FETCH_ERROR'

export function fetchLibraryError (error) {
  return {
    type: FETCH_LIBRARY_ERROR,
    error
  }
}
