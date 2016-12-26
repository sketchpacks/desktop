const { ipcRenderer, remote } = require('electron')
const ms = require('ms')


const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

function installPluginRequest (plugin) {
  return (dispatch, getState) => {
    ipcRenderer.send(INSTALL_PLUGIN_REQUEST, plugin)
  }
}


const INSTALL_PLUGIN_PROGRESS = 'manager/INSTALL_PROGRESS'

function installPluginProgress (plugin, bytesReceived, bytesTotal) {
  return {
    type: INSTALL_PLUGIN_PROGRESS,
    plugin,
    progress: {
      bytesTotal: bytesTotal,
      bytesReceived: bytesReceived,
      percentage: ((bytesReceived / bytesTotal) * 100)
    }
  }
}


const INSTALL_PLUGIN_SUCCESS = 'manager/INSTALL_SUCCESS'

function installPluginSuccess (plugin) {
  return {
    type: INSTALL_PLUGIN_SUCCESS,
    plugin
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
    plugin
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
  installPluginProgress,
  installPluginSuccess,
  installPluginError,

  uninstallPluginRequest,
  uninstallPluginSuccess,
  uninstallPluginError,

  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_PROGRESS,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,

  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
}
