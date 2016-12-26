import { ipcRenderer, remote } from 'electron'

import ms from 'ms'

export const INSTALL_PLUGIN_REQUEST = 'manager/INSTALL_REQUEST'

export function installPluginRequest (plugin) {
  return (dispatch, getState) => {
    ipcRenderer.send('manager/INSTALL_REQUEST', plugin)
  }
}


export const INSTALL_PLUGIN_PROGRESS = 'manager/INSTALL_PROGRESS'

export function installPluginProgress (plugin, bytesReceived, bytesTotal) {
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


export const INSTALL_PLUGIN_SUCCESS = 'manager/INSTALL_SUCCESS'

export function installPluginSuccess (plugin) {
  return {
    type: INSTALL_PLUGIN_SUCCESS,
    plugin
  }
}


export const INSTALL_PLUGIN_ERROR = 'manager/INSTALL_ERROR'

export function installPluginError (error, plugin) {
  return {
    type: INSTALL_PLUGIN_ERROR,
    error: error,
    plugin
  }
}
