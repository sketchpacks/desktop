const {remote} = require('electron')
const path = require('path')
const {includes,values,reduce} = require('lodash')
const os = require('os')
const jsonfile = require('jsonfile')
const semver = require('semver')

const {sanitizeSemVer} = require('lib/utils')

const sketchpackPath = path.join(remote.app.getPath('userData'), 'sketchpack.json')

const {
  TOGGLE_VERSION_LOCK_SUCCESS,
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
} = require('actions/plugin_manager')

const WATCHED_ACTIONS = {
  TOGGLE_VERSION_LOCK_SUCCESS,
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
}

const {fetchLibraryReceived} = require('../actions/index')

const sketchpackMiddleware = store => next => action => {
  const prevState = store.getState().library.items
  next(action)
  const nextState = store.getState().library.items

  if (includes(values(WATCHED_ACTIONS),action.type)) {

    const reducedPlugins = (collection) => reduce(collection, ((result, value, key) => {
    	result[`${value.owner.handle}/${value.name}`] = {
        name: value.name,
        owner: value.owner.handle,
        version: value.version || "^0.0.0",
        version_range: semver.toComparators(value.version)[0],
    		compatible_version: value.compatible_version || "^0.0.0"
      }

    	return result
    }), {})

    const data = {
      name: "My Sketchpack",
      plugins: reducedPlugins(store.getState().library.items)
    }

    const opts = {
      spaces: 2,
      flags: 'w',
      encoding: 'utf8'
    }

    jsonfile.writeFile(sketchpackPath, data, opts, (err) => {
      if (err) console.error(err)
    })
  }
}

export default sketchpackMiddleware
