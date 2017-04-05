const {remote} = require('electron')
const path = require('path')
const {includes,values} = require('lodash')
const jsonfile = require('jsonfile')

const libraryPath = path.join(remote.app.getPath('userData'), 'library.json')

const {
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
} = require('actions/plugin_manager')

const WATCHED_ACTIONS = {
  INSTALL_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_SUCCESS,
  'MIGRATE_CATALOG': 'MIGRATE_CATALOG'
}

const {fetchLibraryReceived} = require('../actions/index')

const libraryMiddleware = store => next => action => {
  next(action)
  
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
      if (err) {
        console.error(err)
        return
      }

      if (data.plugins.length > 0) {
        store.dispatch(fetchLibraryReceived(data.plugins))
      }
    })
  }
}

export default libraryMiddleware
