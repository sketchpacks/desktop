import {MIXPANEL_TOKEN} from '../config'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import mixpanelMiddleware from 'remimi'
import rootReducer from 'reducers'
import sketchpackMiddleware from 'middleware/sketchpack'
import exportMiddleware from 'middleware/export'
import importMiddleware from 'middleware/import'
import notificationMiddleware from 'middleware/notification'

import {SketchpacksApi} from 'api'

const logger = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk.withExtraArgument({api: SketchpacksApi}),
    logger,
    sketchpackMiddleware,
    importMiddleware,
    exportMiddleware,
    notificationMiddleware,
    mixpanelMiddleware(MIXPANEL_TOKEN),
  )
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
