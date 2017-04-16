import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import app from 'reducers/app'
import plugins from 'reducers/plugins'
import users from 'reducers/users'
import library from 'reducers/library'
import sketchpack from 'reducers/sketchpack'

const rootReducer = combineReducers({
  routing: routerReducer,
  library,
  app,
  users,
  plugins,
  sketchpack
})

export default rootReducer
