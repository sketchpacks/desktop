import { createAction, handleActions } from 'redux-actions'
import { pick } from 'lodash'


//- Actions

export const installPlugin = createAction('manager/INSTALL_SUCCESS')
export const detectPlugin = createAction('library/FETCH_RECEIVED')


//- State

const initialState = {
  plugins: {
    byIdentifier: {},
    allIdentifiers: []
  }
}


//- Reducers

export default handleActions({
  [installPlugin]: (state, action) => ({
    ...state,
    plugins: {
      ...state.plugins,
      byIdentifier: {
        ...state.plugins.byIdentifier,
        [action.plugin.identifier]: {
          install_path: action.plugin.install_path
        }
      }
    }
  }),

  [detectPlugin]: (state, action) => ({
    ...state,
    plugins: {
      ...state.plugins,
      byIdentifier: {
        ...state.plugins.byIdentifier,
        [action.payload.result]: pick(
          action.payload.entities.plugins[action.payload.result],
          ['install_path', 'manifest_path', 'version', 'compatible_version']
        )
      },
      allIdentifiers: state.plugins.allIdentifiers.concat(action.payload.result)
    }
  })
}, initialState)
