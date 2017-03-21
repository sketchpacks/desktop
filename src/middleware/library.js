const {remote} = require('electron')
const path = require('path')
const {includes,values} = require('lodash')
const os = require('os')
const jsonfile = require('jsonfile')

const {sanitizeSemVer} = require('lib/utils')

const libraryPath = path.join(remote.app.getPath('userData'), 'library.json')

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
  'MIGRATE_CATALOG': 'MIGRATE_CATALOG'
}

const {fetchLibraryReceived} = require('../actions/index')

const libraryMiddleware = store => next => action => {
  const prevState = store.getState().library.items
  next(action)
  const nextState = store.getState().library.items

  if (includes(values(WATCHED_ACTIONS),action.type)) {
    const data = {
      plugins: store.getState().library.items
    }

    const opts = {
      spaces: 2,
      flags: 'w',
      encoding: 'utf8'
    }

    jsonfile.writeFile(libraryPath, data, opts, (err) => {
      if (err) console.error(err)
      store.dispatch(fetchLibraryReceived(data.plugins))
    })
  }
}

export default libraryMiddleware
