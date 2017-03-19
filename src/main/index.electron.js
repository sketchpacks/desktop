import {
  __PRODUCTION__,
  __ELECTRON__
} from 'config'

import pkg from '../../package'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import { ipcRenderer, ipcMain } from 'electron'
import waterfall from 'async/waterfall'
import Promsie from 'promise'
import log from 'electron-log'
import firstRun from 'first-run'
import path from 'path'

import os from 'os'
import jsonfile from 'jsonfile'

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
  TOGGLE_VERSION_LOCK_SUCCESS
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

const loadLibrary = () => {
  const libraryPath = `${os.homedir()}/Desktop/sketchpack.json`

  const data = jsonfile.readFileSync(libraryPath)
  store.dispatch(fetchLibraryReceived(data.plugins))
}
loadLibrary()

ipcRenderer.on('IMPORT_FROM_SKETCH_TOOLBOX', (evt, pluginId) => {
  browserHistory.push('library/installed')
  ipcRenderer.send('IMPORT_FROM_SKETCH_TOOLBOX')
})

ipcRenderer.on('EXTERNAL_PLUGIN_INSTALL_REQUEST', (evt, pluginId) => {
  Catalog.getPluginById(pluginId)
    .then((plugin) => {
      store.dispatch(installPluginRequest(plugin))

      const notif = new window.Notification('Sketchpacks', {
        body: `Installing ${plugin.title} v${plugin.installed_version}...`,
        silent: true,
        icon: path.join(__dirname, 'src/static/images/icon.png'),
      })
    })
})

ipcRenderer.on(TOGGLE_VERSION_LOCK_REQUEST, (evt,args) => {
  Catalog.toggleVersionLock({id: args.id, locked: args.locked})
    .then((plugin) => {

      const result = args.locked ? 'unlocked' : 'locked'

      const notif = new window.Notification('Sketchpacks', {
        body: `${plugin.title} v${plugin.installed_version} ${result}`,
        silent: true,
        icon: path.join(__dirname, 'src/static/images/icon.png'),
      })

      store.dispatch(toggleVersionLockSuccess(plugin))
    })
})

ipcRenderer.on(INSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  const notif = new window.Notification('Sketchpacks', {
    body: `${plugin.title} v${plugin.installed_version} installed`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })

  store.dispatch(installPluginSuccess(plugin))
})

ipcRenderer.on(UPDATE_PLUGIN_SUCCESS, (evt,plugin) => {
  Catalog.pluginInstalled(plugin)
    .then((plugin) => {
      const notif = new window.Notification('Sketchpacks', {
        body: `${plugin.title} updated to v${plugin.installed_version}`,
        silent: true,
        icon: path.join(__dirname, 'src/static/images/icon.png'),
      })

      store.dispatch(updatePluginSuccess(plugin))
    })
})

ipcRenderer.on(UNINSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  const notif = new window.Notification('Sketchpacks', {
    body: `${plugin.title} TEST`,
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
  })

  store.dispatch(uninstallPluginSuccess(plugin))
})

ipcRenderer.on('CHECK_FOR_PLUGIN_UPDATES', (evt) => {
  log.info('CHECK_FOR_PLUGIN_UPDATES')
  Catalog.update()
    .then(plugins => Catalog.autoUpdatePlugins())
})

ipcRenderer.on('CHECK_FOR_CLIENT_UPDATES', (evt, args) => {
  ipcRenderer.send('CHECK_FOR_CLIENT_UPDATES', args)
})

ipcRenderer.on('CHECK_FOR_CATALOG_UPDATES', (evt) => {
  Catalog.update()
})



if (firstRun({name: `${pkg.name}-${pkg.version}`})) {
  store.dispatch(appInstall(`v${pkg.version}`))
}
