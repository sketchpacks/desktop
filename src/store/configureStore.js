import {
  MIXPANEL_TOKEN,
  __PRODUCTION__,
  __ELECTRON__
} from '../config'

import 'regenerator-runtime/runtime'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory, hashHistory } from 'react-router'
import createLogger from 'redux-logger'
import mixpanelMiddleware from 'remimi'
import rootReducer from 'reducers'
import sketchpackMiddleware from 'middleware/sketchpack'
import exportMiddleware from 'middleware/export'
import importMiddleware from 'middleware/import'
import notificationMiddleware from 'middleware/notification'
import syncMiddleware from 'middleware/sync'

import sagas from 'sagas'

import { SketchpacksApi } from 'api'

const logger = createLogger()

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware((__PRODUCTION__ && __ELECTRON__) ? hashHistory : browserHistory),
    thunk.withExtraArgument({ api: SketchpacksApi }),
    syncMiddleware,
    logger,
    importMiddleware,
    exportMiddleware,
    notificationMiddleware,
    sketchpackMiddleware,
    mixpanelMiddleware(MIXPANEL_TOKEN)
  )
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(sagas)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
