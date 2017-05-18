import { reduce } from 'lodash'
import writeSketchpack from 'lib/writeSketchpack'
import { exportSketchpackRequest,exportSketchpackSuccess } from 'reducers/sketchpack'

const {
  getSketchpackIdentifiers,
  syncSketchpackContents
} = require('reducers')

const exportMiddleware = store => next => action => {
  next(action)

  const sketchpack = store.getState().sketchpack

  if (action.type === exportSketchpackRequest.toString()) {
    const identifiers = getSketchpackIdentifiers(store.getState())

    const contents = reduce(identifiers, (plugins, identifier) => {
      plugins[identifier] = {
        ...store.getState().sketchpack.plugins.byIdentifier[identifier]
      }
      return plugins
    }, {})

    writeSketchpack(
      action.payload,
      contents,
      () => {
        store.dispatch(
          exportSketchpackSuccess({}, {
            total: identifiers.length,
            plugins: identifiers,
            mixpanel: {
              eventName: 'Manage',
              type: 'Export',
              props: {
                source: 'desktop',
                name: sketchpack.name,
                isLocked: sketchpack.isLocked,
                plugins: identifiers,
                total: identifiers.length
              }
            }
          })
        )
      }
    )
  }
}

export default exportMiddleware
