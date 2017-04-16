import { createAction, handleActions } from 'redux-actions'
import { pick } from 'lodash'


//- Actions

export const installPlugin = createAction('manager/INSTALL_SUCCESS')
export const detectPlugin = createAction('library/FETCH_RECEIVED')


//- State

const initialState = {
  byIdentifier: {},
  allIdentifiers: []
}


//- Reducers

export default handleActions({
  [installPlugin]: (state, action) => ({
    ...state,
    byIdentifier: {
      ...state.byIdentifier,
      [action.plugin.identifier]: {
        install_path: action.plugin.install_path
      }
    }
  }),

  [detectPlugin]: (state, action) => ({
    ...state,
    byIdentifier: {
      ...state.byIdentifier,
      [action.payload.result]: pick(
        action.payload.entities.plugins[action.payload.result],
        ['install_path', 'manifest_path', 'version', 'compatible_version']
      )
    },
    allIdentifiers: state.allIdentifiers.concat(action.payload.result)
  })
}, initialState)


//- Selectors

export const getLibraryEntities = state => state.library.byIdentifier
export const getLibrary = (state) => state.library
