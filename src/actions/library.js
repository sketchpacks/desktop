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
