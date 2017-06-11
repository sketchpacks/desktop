import { reduce, pick } from 'lodash'
import writeSketchpack from 'lib/writeSketchpack'
import { exportSketchpackRequest, exportSketchpackSuccess } from 'reducers/sketchpack'

const {
  getSketchpackIdentifiers,
  syncSketchpackContents
} = require('reducers')

const exportMiddleware = store => next => action => {
  next(action)

  const sketchpack = store.getState().sketchpack

  if (!sketchpack.isLoaded) return

  if (action.type === 'sketchpack/EXPORT_REQUEST') {
    const identifiers = getSketchpackIdentifiers(store.getState())

    const newContents = reduce(identifiers, (plugins, identifier) => {
      plugins[identifier] = {
        ...store.getState().sketchpack.plugins.byIdentifier[identifier]
      }
      return plugins
    }, {})

    const newSketchpack = Object.assign({},
      ...pick(sketchpack, 'name', 'schema_version', 'locked', 'plugins'),
      {
        plugins: newContents
      }
    )

    writeSketchpack(
      action.payload,
      newSketchpack,
      () => {
        store.dispatch(
          exportSketchpackSuccess({}, {
            total: identifiers.length,
            plugins: identifiers
          })
        )
      }
    )
  }
}

export default exportMiddleware
