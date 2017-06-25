const path = require('path')
const { remote } = require('electron')
const semver = require('semver')
const {
  includes,
  values,
  reduce,
  isEqual,
  difference
} = require('lodash')

const json5file = require('@sketchpacks/json5file')
const writeSketchpack = require('lib/writeSketchpack')

const {
  getSketchpackIdentifiers
} = require('reducers')

const {
  importSketchpackSuccess,
  exportSketchpackRequest
} = require('reducers/sketchpack')

const sketchpackMiddleware = store => next => action => {
  const prevSketchpack = store.getState().sketchpack.plugins
  next(action)
  const nextSketchpack = store.getState().sketchpack.plugins

  if (store.getState().sketchpack.isLocked) return

  const addedPlugins = difference(
    prevSketchpack.allIdentifiers,
    nextSketchpack.allIdentifiers
  )

  const removedPlugins = difference(
    nextSketchpack.allIdentifiers,
    prevSketchpack.allIdentifiers
  )

  if ((addedPlugins.length > 0) || (removedPlugins.length > 0)) {
    store.dispatch(
      exportSketchpackRequest(store.getState().preferences.syncing.sketchpack_path)
    )
  }
}

export default sketchpackMiddleware
