import {
  __PRODUCTION__,
  __ELECTRON__,
  PLUGIN_AUTOUPDATE_INTERVAL,
  PLUGIN_AUTOUPDATE_DELAY
} from 'config'

import pkg from '../../package'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory, hashHistory } from 'react-router'
import { syncHistoryWithStore,push } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import { ipcRenderer, ipcMain, remote } from 'electron'
import log from 'electron-log'
import firstRun from 'first-run'
import path from 'path'

import readSketchpack from 'lib/readSketchpack'

import ms from 'ms'
import os from 'os'
import fs from 'fs'
import json5file from '@sketchpacks/json5file'
import { filter,has } from 'lodash'

import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import { fetchPlugin } from 'reducers/plugins'

import App from 'containers/App'
import AppError from 'errors/AppError'

import BrowsePlugins from 'views/BrowsePlugins'
import SearchResults from 'views/SearchResults'
import ManagedPlugins from 'views/ManagedPlugins'
import UnmanagedPlugins from 'views/UnmanagedPlugins'
import UpdatedPlugins from 'views/UpdatedPlugins'

import PluginDetails from 'views/PluginDetails'

import UserProfile from 'views/UserProfile'
import UserPlugins from 'views/UserPlugins'

import Preferences from 'views/Preferences'

import { appInstall } from 'actions'

import {
  installPluginError,
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,

  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,

  webInstallPluginRequest
} from 'actions/plugin_manager'

import {
  autoUpdatePluginsRequest,
} from 'actions/auto_updater'

import {
  addPlugin
} from 'reducers/plugins'

import {
  identifyPlugin,
  detectPlugin,
  installPluginSuccess,
  uninstallPluginSuccess,
  updatePluginSuccess
} from 'reducers/library'

import {
  syncSketchpackRequest,
  importSketchpackRequest,
  exportSketchpackRequest
} from 'reducers/sketchpack'

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

          <Route path="search" component={SearchResults} />

          <Route path="library/managed" component={ManagedPlugins} />
          <Route path="library/unmanaged" component={UnmanagedPlugins} />
          <Route path="library/updates" component={UpdatedPlugins} />

          <Route path="preferences" component={Preferences} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
  )

  ipcRenderer.send('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', null)

  ipcRenderer.send('APP_WINDOW_OPEN', null)

  loadSketchpack()

  store.dispatch(push(`/browse/newest?page=1&sort=score%3Adesc`))
}

const autoUpdatePlugins = () => store.dispatch(autoUpdatePluginsRequest({ repeat: true }))

const loadSketchpack = () => {
  const sketchpackPath = path.join(remote.app.getPath('userData'), 'my-library.sketchpack')
  readSketchpack(sketchpackPath)
    .then(contents => store.dispatch(syncSketchpackRequest(contents)))

}


ipcRenderer.on('sketchpack/IMPORT', (evt,contents) => {
  browserHistory.push('/library/managed')
  store.dispatch(importSketchpackRequest(contents))
})

ipcRenderer.on('sketchpack/IMPORT_REQUEST', (evt,args) => {
  log.debug(args)
  ipcRenderer.send('sketchpack/IMPORT_REQUEST')

  store.dispatch({
    type: 'behavior_tracking',
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: 'Import'
      }
    }
  })
})

ipcRenderer.on('sketchpack/EXPORT_REQUEST', (evt,args) => {
  ipcRenderer.send('sketchpack/EXPORT_REQUEST')
})

ipcRenderer.on('sketchpack/EXPORT', (evt,filepath) => {
  store.dispatch(exportSketchpackRequest(filepath))

  store.dispatch({
    type: 'behavior_tracking',
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: 'Import'
      }
    }
  })
})

ipcRenderer.on('sketchpack/SYNC_REQUEST', (evt,contents) => {
  log.debug('sketchpack/SYNC_REQUEST',contents)
  store.dispatch(syncSketchpackRequest(contents))
})

ipcRenderer.on(INSTALL_PLUGIN_REQUEST, (evt,identifiers) => {
  store.dispatch('registry/IDENTIFY_PLUGIN_REQUEST', identifiers)
  ipcRenderer.send(INSTALL_PLUGIN_REQUEST,plugin)
})

ipcRenderer.on('library/INSTALL_PLUGIN_SUCCESS', (evt,identifier) => {
  store.dispatch(installPluginSuccess(identifier, {
    notification: true,
    mixpanel: {
      eventName: 'Manage',
      type: 'Install Plugin',
      props: {
        source: 'desktop',
        pluginId: identifier
      }
    }
  }))
})

// ipcRenderer.on(INSTALL_PLUGIN_ERROR, (evt,filepath) => {
//   browserHistory.push('/library/managed')
//   store.dispatch(importSketchpackRequest(filepath))
// })


ipcRenderer.on('EXTERNAL_PLUGIN_INSTALL_REQUEST', (evt, identifiers) => {
  store.dispatch(fetchPlugin({ identifiers }))
  store.dispatch(push(`/library/installed`))
  ipcRenderer.send(INSTALL_PLUGIN_REQUEST,identifiers)
})

ipcRenderer.on(INSTALL_PLUGIN_ERROR, (evt, err, plugin) => {
  store.dispatch({
    type: INSTALL_PLUGIN_ERROR,
    error: true,
    payload: new AppError(err),
    meta: {
      plugin,
      notification: true
    }
  })
})

ipcRenderer.on('library/UPDATE_PLUGIN_SUCCESS', (evt,plugin) => {
  const normalizedPlugin = normalize(plugin, schemas.pluginSchema)
  store.dispatch(addPlugin(normalizedPlugin))

  store.dispatch(updatePluginSuccess(plugin.identifier, {
    notification: true,
    mixpanel: {
      eventName: 'Manage',
      type: 'Update Plugin',
      props: {
        source: 'desktop',
        pluginId: plugin.identifier,
        pluginVersion: normalizedPlugin.entities.plugins[normalizedPlugin.result].version
      }
    }
  }))
})

ipcRenderer.on('CHECK_FOR_PLUGIN_UPDATES', (evt) => {
  store.dispatch(autoUpdatePluginsRequest({repeat: false}))
})

ipcRenderer.on('CHECK_FOR_CLIENT_UPDATES', (evt, args) => {
  ipcRenderer.send('CHECK_FOR_CLIENT_UPDATES', args)
})

ipcRenderer.on('PLUGIN_DETECTED', (evt,plugin) => {
  store.dispatch({
    type: 'registry/IDENTIFY_PLUGIN_REQUEST',
    payload: {
      plugin,
      resource: 'plugins'
    },
    meta: { notification: false }
  })
})


ipcRenderer.on(UNINSTALL_PLUGIN_SUCCESS, (evt,plugin) => {
  store.dispatch(uninstallPluginSuccess(plugin.identifier, {
    notification: true,
    mixpanel: {
      eventName: 'Manage',
      type: 'Remove Plugin',
      props: {
        source: 'desktop',
        pluginId: plugin.identifier
      }
    }
  }))
})


if (firstRun({name: `${pkg.name}-${pkg.version}`})) {
  store.dispatch(appInstall(`v${pkg.version}`))
}
