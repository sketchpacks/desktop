import { createAction, handleActions } from 'redux-actions'


//- Actions

export const changeLocation = createAction('@@router/LOCATION_CHANGE')


//- State

const initialState = {
  location: '/browse/popular'
}


//- Reducers

export default handleActions({
  [changeLocation]: (state, action) => ({
    ...state,
    location: action.payload.pathname
  })
}, initialState)


//- Selectors
