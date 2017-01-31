import { remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import { ipcRenderer } from 'electron'
import Promsie from 'promise'

import _ from 'lodash'

import App from 'containers/App'

import PopularPlugins from 'views/PopularPlugins'
import NewestPlugins from 'views/NewestPlugins'
import InstalledPlugins from 'views/InstalledPlugins'
import UpdatedPlugins from 'views/UpdatedPlugins'

import PluginDetails from 'views/PluginDetails'
import SearchResults from 'views/SearchResults'

import UserProfile from 'views/UserProfile'
import UserRecommends from 'views/UserRecommends'
import UserPlugins from 'views/UserPlugins'

import {
  pluginsRequest,
  pluginsReceived,
} from 'actions'

import {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  uninstallPluginSuccess,
  uninstallPluginError,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
} from 'actions/plugin_manager'

let store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={PopularPlugins} />
          <Route path="browse/popular" component={PopularPlugins} />
          <Route path="browse/newest" component={NewestPlugins} />

          <Route path="search" component={SearchResults} />

          <Route path="library/installed" component={InstalledPlugins} />
          <Route path="library/updates" component={UpdatedPlugins} />


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

  ipcRenderer.send('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', null)
}

const catalogCheck = () => {
  if (window.Catalog === undefined) {
    setTimeout(catalogCheck, 100)
  }
  else {
    Catalog.setStore(store)
    Catalog.enableAutoUpdate()

    store.dispatch(pluginsRequest())
    Catalog.getAllPlugins()
      .then(plugins => store.dispatch(pluginsReceived(plugins)))
  }
}
catalogCheck()

ipcRenderer.on('EXTERNAL_PLUGIN_INSTALL_REQUEST', (evt, pluginId) => {
  Catalog.getPluginById(pluginId)
    .then((plugin) => store.dispatch(installPluginRequest(plugin)))
})

ipcRenderer.on(INSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  Catalog.pluginInstalled(plugin)
    .then((plugin) => {
      Catalog.getAllPlugins()
        .then((plugins) => store.dispatch(pluginsReceived(plugins)))
    })
})

ipcRenderer.on(UNINSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  Catalog.pluginRemoved(plugin)
    .then((plugin) => {
      Catalog.getAllPlugins()
        .then((plugins) => store.dispatch(pluginsReceived(plugins)))
    })
})
