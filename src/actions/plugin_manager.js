const {
  API_URL,
  PLUGIN_AUTOUPDATE_DELAY,
  PLUGIN_AUTOUPDATE_INTERVAL
} = require('../config')

const { ipcRenderer } = require('electron')

const ms = require('ms')
const axios = require('axios')
const semver = require('semver')
const {filter} = require('lodash')

const {sanitizeSemVer} = require('../lib/utils')



const TOGGLE_VERSION_LOCK_REQUEST = 'manager/TOGGLE_VERSION_LOCK_REQUEST'

function toggleVersionLockRequest (plugin) {
  return (dispatch, getState) => {
    dispatch(toggleVersionLockSuccess(plugin))
  }
}


const TOGGLE_VERSION_LOCK_SUCCESS = 'manager/TOGGLE_VERSION_LOCK_SUCCESS'

function toggleVersionLockSuccess (plugin) {
  const isLocked = plugin.version.indexOf('^') === -1

  return {
    type: TOGGLE_VERSION_LOCK_SUCCESS,
    plugin,
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: isLocked ? 'Lock Plugin Version' : 'Unlock Plugin Version',
        props: {
          source: 'desktop',
          pluginId: plugin.id,
          pluginVersion: plugin.installed_version
        },
      },
    },
  }
}


const TOGGLE_VERSION_LOCK_ERROR = 'manager/TOGGLE_VERSION_LOCK_ERROR'

function toggleVersionLockError (plugin) {
  return {
    type: TOGGLE_VERSION_LOCK_ERROR,
    plugin
  }
}


const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

function installPluginRequest (plugin) {
  return (dispatch, getState) => {
    ipcRenderer.send(INSTALL_PLUGIN_REQUEST, plugin)
  }
}

function webInstallPluginRequest (pluginId) {
  return (dispatch, getState, {api}) => {
    api.getPluginById({ pluginId })
      .then(response => dispatch(installPluginRequest(response.data)))
  }
}


const INSTALL_PLUGIN_SUCCESS = 'manager/INSTALL_SUCCESS'

function installPluginSuccess (plugin) {
  return {
    type: INSTALL_PLUGIN_SUCCESS,
    plugin,
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: 'Install Plugin',
        props: {
          source: 'desktop',
          pluginId: plugin.id,
          pluginVersion: plugin.installed_version
        },
      },
    },
  }
}


const INSTALL_PLUGIN_ERROR = 'manager/INSTALL_ERROR'

function installPluginError (error, plugin) {
  return {
    type: INSTALL_PLUGIN_ERROR,
    error: error,
    plugin
  }
}


const UPDATE_PLUGIN_REQUEST = 'manager/UPDATE_REQUEST'

function updatePluginRequest (plugin) {
  return (dispatch, getState, {api}) => {
    api.getPluginUpdate({ pluginId: plugin.id, version: sanitizeSemVer(plugin.version) })
      .then(response => {
        if (response.status === 204) return

        const update = response.data[0]

        const updatedPlugin = Object.assign(plugin, {
          version: sanitizeSemVer(update.version),
          download_url: update.download_url
        })

        ipcRenderer.send(UPDATE_PLUGIN_REQUEST, updatedPlugin)
      })
  }
}


const UPDATE_PLUGIN_SUCCESS = 'manager/UPDATE_SUCCESS'

function updatePluginSuccess (plugin) {
  return {
    type: UPDATE_PLUGIN_SUCCESS,
    plugin,
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: 'Update Plugin',
        props: {
          source: 'desktop',
          pluginId: plugin.id,
          pluginVersion: plugin.installed_version
        },
      },
    },
  }
}


const UPDATE_PLUGIN_ERROR = 'manager/UPDATE_ERROR'

function updatePluginError (error, plugin) {
  return {
    type: UPDATE_PLUGIN_ERROR,
    error: error,
    plugin
  }
}


const UNINSTALL_PLUGIN_REQUEST = 'manager/UNINSTALL_REQUEST'

function uninstallPluginRequest (plugin) {
  return (dispatch, getState) => {
    ipcRenderer.send(UNINSTALL_PLUGIN_REQUEST, plugin)
  }
}

const UNINSTALL_PLUGIN_SUCCESS = 'manager/UNINSTALL_SUCCESS'

function uninstallPluginSuccess (plugin) {
  return {
    type: UNINSTALL_PLUGIN_SUCCESS,
    plugin,
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: 'Uninstall Plugin',
        props: {
          source: 'desktop',
          pluginId: plugin.id,
        },
      },
    },
  }
}


const UNINSTALL_PLUGIN_ERROR = 'manager/UNINSTALL_ERROR'

function uninstallPluginError (error, plugin) {
  return {
    type: INSTALL_PLUGIN_ERROR,
    error: error,
    plugin
  }
}

const pluginData = (owner,slug) => new Promise((resolve,reject) => {
  axios.get(`${API_URL}/v1/users/${owner}/plugins/${slug.toLowerCase()}`)
    .then(response => {
      resolve(response.data)
    })
    .catch(response => {
      resolve({})
    })
})

function updateAvailable (remote,local) {
  let remoteVersion = sanitizeSemVer(plugin.version)
  let localVersion = sanitizeSemVer(plugin.installed_version)

  return semver.lt(localVersion,remoteVersion)
}

const AUTOUPDATE_PLUGINS_REQUEST = 'manager/AUTOUPDATE_PLUGINS'

function autoUpdatePluginsRequest () {
  return (dispatch, getState, {api}) => {
    const plugins = getState().library.items
    const unlockedPlugins = filter(plugins, (p) => p.version.indexOf('^') > -1)

    unlockedPlugins.forEach(plugin => dispatch(updatePluginRequest(plugin)))

    setTimeout(() => dispatch(autoUpdatePluginsRequest()), ms(PLUGIN_AUTOUPDATE_DELAY))

    return {
      type: AUTOUPDATE_PLUGINS_REQUEST,
      payload: plugins
    }
  }
}


module.exports = {
  installPluginRequest,
  installPluginSuccess,
  installPluginError,

  updatePluginRequest,
  updatePluginSuccess,
  updatePluginError,

  uninstallPluginRequest,
  uninstallPluginSuccess,
  uninstallPluginError,

  toggleVersionLockRequest,
  toggleVersionLockSuccess,
  toggleVersionLockError,

  TOGGLE_VERSION_LOCK_REQUEST,
  TOGGLE_VERSION_LOCK_SUCCESS,
  TOGGLE_VERSION_LOCK_ERROR,

  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_ERROR,

  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR,

  autoUpdatePluginsRequest,
  webInstallPluginRequest
}
