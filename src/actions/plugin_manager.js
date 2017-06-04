const {
  API_URL,
  PLUGIN_AUTOUPDATE_DELAY,
  PLUGIN_AUTOUPDATE_INTERVAL
} = require('../config')

const { ipcRenderer } = require('electron')

const log = require('electron-log')
const ms = require('ms')
const {find} = require('lodash')

const {sanitizeSemVer} = require('../lib/utils')


const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

function installPluginRequest (plugin) {
  return (dispatch, getState) => {
    dispatch({
      type: 'library/INSTALL_PLUGIN_REQUEST',
      payload: plugin
    })
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

function installPluginSuccess (identifier) {
  return {
    type: INSTALL_PLUGIN_SUCCESS,
    payload: identifier,
    meta: {
      notification: true
    }
  }
}


const INSTALL_PLUGIN_ERROR = 'manager/INSTALL_ERROR'

function installPluginError (error, plugin) {
  return {
    type: INSTALL_PLUGIN_ERROR,
    error: error,
    payload: plugin
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
          pluginId: `${plugin.owner.handle}/${plugin.name}`,
          pluginVersion: plugin.version
        },
      },
      notification: {
        title: 'Sketchpacks',
        message: `${plugin.name} updated to ${plugin.version}`
      }
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
    const removable = find(getState().library.items, (item) => {
      return plugin.owner.handle === item.owner.handle
        && plugin.name === item.name
    })

    ipcRenderer.send(UNINSTALL_PLUGIN_REQUEST, removable)
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
          pluginId: `${plugin.owner.handle}/${plugin.name}`,
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

  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_ERROR,

  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR,

  webInstallPluginRequest
}
