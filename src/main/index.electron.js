import {
  __PRODUCTION__,
  __ELECTRON__,
  PLUGIN_AUTOUPDATE_INTERVAL
} from 'config'

import pkg from '../../package'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import { ipcRenderer, ipcMain, remote } from 'electron'
import log from 'electron-log'
import firstRun from 'first-run'
import path from 'path'

import ms from 'ms'
import os from 'os'
import fs from 'fs'
import jsonfile from 'jsonfile'
import {filter} from 'lodash'

import App from 'containers/App'

import BrowsePlugins from 'views/BrowsePlugins'
import InstalledPlugins from 'views/InstalledPlugins'
import UpdatedPlugins from 'views/UpdatedPlugins'

import PluginDetails from 'views/PluginDetails'
import SearchResults from 'views/SearchResults'

import UserProfile from 'views/UserProfile'
import UserPlugins from 'views/UserPlugins'

import {
  appInstall,

  pluginsRequest,
  pluginsReceived,

  fetchLibraryRequest,
  fetchLibraryReceived,

  FETCH_LIBRARY_REQUEST,
  FETCH_LIBRARY_RECEIVED,
} from 'actions'

import {
  installPluginRequest,
  installPluginSuccess,
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,

  updatePluginRequest,
  updatePluginSuccess,
  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,

  uninstallPluginRequest,
  uninstallPluginSuccess,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,

  toggleVersionLockRequest,
  toggleVersionLockSuccess,
  TOGGLE_VERSION_LOCK_REQUEST,
  TOGGLE_VERSION_LOCK_SUCCESS,

  autoUpdatePluginsRequest,
  webInstallPluginRequest
} from 'actions/plugin_manager'

let store = configureStore()
const history = syncHistoryWithStore((__PRODUCTION__ && __ELECTRON__) ? hashHistory : browserHistory, store)

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={BrowsePlugins} />
          <Route path="browse" component={BrowsePlugins} />
          <Route path="browse/popular" component={BrowsePlugins} />
          <Route path="browse/newest" component={BrowsePlugins} />
          <Route path="browse/name" component={BrowsePlugins} />

          <Route path="search" component={BrowsePlugins} />

          <Route path="library/installed" component={InstalledPlugins} />
          <Route path="library/updates" component={UpdatedPlugins} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
  )

  ipcRenderer.send('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', null)
}

const autoUpdatePlugins = () => store.dispatch(autoUpdatePluginsRequest())

const loadLibrary = () => {
  const libraryPath = path.join(remote.app.getPath('userData'), 'library.json')

  const opts = {
    flag: 'r',
    encoding: 'utf8'
  }

  try {
    jsonfile.readFile(libraryPath, opts, (err, data) => {
      const contents = !(err)
        ? data
        : { plugins: [] }

      if (contents.plugins.length > 0) store.dispatch(fetchLibraryReceived(contents.plugins))
    })
  } catch (err) {
    console.log(err)
  }

  setTimeout(autoUpdatePlugins, ms(PLUGIN_AUTOUPDATE_INTERVAL))
}
loadLibrary()

const migrateCatalog = (catalogPath) => {
  const Datastore = require('nedb')
  const db = new Datastore({ filename: catalogPath })
  db.loadDatabase((err) => {
    if (err) console.log(err)
    db.find({ installed: true }, (err, docs) => {
      store.dispatch(fetchLibraryReceived(docs))
      store.dispatch({
        type: 'MIGRATE_CATALOG',
        payload: docs
      })
      fs.unlink(catalogPath)
    })
  })
}

let catalogPath = path.join(remote.app.getPath('userData'), 'catalog.db')
if (fs.existsSync(catalogPath)) {
  migrateCatalog(catalogPath)
}



ipcRenderer.on('IMPORT_FROM_SKETCH_TOOLBOX', (evt, pluginId) => {
  browserHistory.push('library/installed')
  ipcRenderer.send('IMPORT_FROM_SKETCH_TOOLBOX')
})


ipcRenderer.on('EXTERNAL_PLUGIN_INSTALL_REQUEST', (evt, pluginId) => {
  store.dispatch(webInstallPluginRequest(pluginId))
  browserHistory.push('library/installed')

  const notif = new window.Notification('Sketchpacks', {
    body: `Starting install...`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })
})


ipcRenderer.on(TOGGLE_VERSION_LOCK_REQUEST, (evt,args) => {
  store.dispatch(toggleVersionLockSuccess(args))
})

ipcRenderer.on(INSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  const notif = new window.Notification('Sketchpacks', {
    body: `${plugin.title} v${plugin.version} installed`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })

  store.dispatch(installPluginSuccess(plugin))
})

ipcRenderer.on(UPDATE_PLUGIN_SUCCESS, (evt,plugin) => {
  const notif = new window.Notification('Sketchpacks', {
    body: `${plugin.title} updated to v${plugin.version}`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })

  store.dispatch(updatePluginSuccess(plugin))
})

ipcRenderer.on(UNINSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  const notif = new window.Notification('Sketchpacks', {
    body: `${plugin.title} uninstalled`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })

  store.dispatch(uninstallPluginSuccess(plugin))
})

ipcRenderer.on('CHECK_FOR_PLUGIN_UPDATES', (evt) => {
  store.dispatch(autoUpdatePluginsRequest())
})

ipcRenderer.on('CHECK_FOR_CLIENT_UPDATES', (evt, args) => {
  ipcRenderer.send('CHECK_FOR_CLIENT_UPDATES', args)
})


if (firstRun({name: `${pkg.name}-${pkg.version}`})) {
  store.dispatch(appInstall(`v${pkg.version}`))
}
