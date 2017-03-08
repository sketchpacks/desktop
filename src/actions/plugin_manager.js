const { ipcRenderer } = require('electron')

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
    plugin,
    meta: {
      mixpanel: {
        eventName: 'Manage',
        type: plugin.locked ? 'Lock Plugin Version' : 'Unlock Plugin Version',
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
  return (dispatch, getState) => {
    ipcRenderer.send(UPDATE_PLUGIN_REQUEST, plugin)
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
  UNINSTALL_PLUGIN_ERROR
}
