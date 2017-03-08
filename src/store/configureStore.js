import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import mixpanelMiddleware from 'remimi'
import rootReducer from 'reducers'

import {SketchpacksApi} from 'api'

const logger = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk.withExtraArgument({api: SketchpacksApi}),
    logger,
    mixpanelMiddleware('83ca491fc0b9796233bffce9e2d7593c'),
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
