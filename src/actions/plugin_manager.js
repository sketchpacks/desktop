const { ipcRenderer, remote } = require('electron')
const ms = require('ms')
const notifier = require('node-notifier')

const TOGGLE_VERSION_LOCK_REQUEST = 'manager/TOGGLE_VERSION_LOCK_REQUEST'

function toggleVersionLockRequest (id, locked) {
  return (dispatch, getState) => {
    ipcRenderer.send(TOGGLE_VERSION_LOCK_REQUEST, {id: id, locked: locked || false} )
  }
}


const TOGGLE_VERSION_LOCK_SUCCESS = 'manager/TOGGLE_VERSION_LOCK_SUCCESS'

function toggleVersionLockSuccess (plugin) {
  return {
    type: TOGGLE_VERSION_LOCK_SUCCESS,
    plugin
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


const INSTALL_PLUGIN_SUCCESS = 'manager/INSTALL_SUCCESS'

function installPluginSuccess (plugin) {
  notifier.notify({
    title: 'test',
    message: 'test',
    sound: true,
    wait: false,
  })

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
  installPluginSuccess,
  installPluginError,

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

  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
}
