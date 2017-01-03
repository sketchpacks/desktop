import { remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import { ipcRenderer } from 'electron'

import _ from 'lodash'

import App from 'containers/App'

import FrontPage from 'views/FrontPage'
import BrowsePlugins from 'views/BrowsePlugins'
import PopularPlugins from 'views/PopularPlugins'
import NewestPlugins from 'views/NewestPlugins'
import PluginDetails from 'views/PluginDetails'
import SearchResults from 'views/SearchResults'

import UserProfile from 'views/UserProfile'
import UserRecommends from 'views/UserRecommends'
import UserPlugins from 'views/UserPlugins'

const CatalogManager = remote.getGlobal('CatalogManager')
const Catalog = remote.getGlobal('Catalog')

import {
  pluginsReceived
} from 'actions'

import {
  installPluginProgress,
  installPluginSuccess,
  installPluginError,
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  uninstallPluginProgress,
  uninstallPluginSuccess,
  uninstallPluginError,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
} from 'actions/plugin_manager'

let store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

const refreshStateFromCatalog = () =>
  Catalog.getAllPlugins()
    .then((plugins) => store.dispatch( pluginsReceived(plugins) ))

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={NewestPlugins} />
          <Route path="browse/popular" component={PopularPlugins} />
          <Route path="browse/newest" component={NewestPlugins} />

          <Route path="search" component={SearchResults} />

          <Route path="@:owner" component={UserProfile}>
            <IndexRedirect to="plugins" />
            <Route path="recommends" component={UserRecommends} />
            <Route path="plugins" component={UserPlugins} />
          </Route>

          <Route path=":owner/:id" component={PluginDetails} />

        </Route>
      </Router>
    </Provider>,

    document.getElementById('root')
  )

  refreshStateFromCatalog()
}

// Download is complete, dispatch installPluginProgress
ipcRenderer.on(INSTALL_PLUGIN_SUCCESS, (evt,arg) => {
  refreshStateFromCatalog()
})

ipcRenderer.on(UNINSTALL_PLUGIN_SUCCESS, (evt,arg) => {
  refreshStateFromCatalog()
})

ipcRenderer.on('catalog/FETCH_REQUEST', (evt,arg) => {
  // UI reflects progress of updating the catalog from GET /plugins/catalog
})

ipcRenderer.on('catalog/FETCH_RECEIVED', (evt,arg) => {
  refreshStateFromCatalog()
})
