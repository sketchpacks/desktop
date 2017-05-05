import {
  API_URL,
  PLUGIN_AUTOUPDATE_DELAY,
  PLUGIN_AUTOUPDATE_INTERVAL
} from '../config'

import { ipcRenderer } from 'electron'

import { getUnlockedPlugins,selectPlugin } from 'reducers'

const AUTOUPDATE_PLUGINS_REQUEST = 'manager/AUTOUPDATE_PLUGINS'

export const autoUpdatePluginsRequest = ({repeat}) => {
  return (dispatch, getState) => {
    dispatch({ type: AUTOUPDATE_PLUGINS_REQUEST })

    const unlockedPlugins = getUnlockedPlugins(getState())
      .map(id => selectPlugin(getState(),id))

    ipcRenderer.send('manager/UPDATE_REQUEST', unlockedPlugins)

    if (repeat) {
      setTimeout(() => dispatch(autoUpdatePluginsRequest({repeat: true})), ms(PLUGIN_AUTOUPDATE_INTERVAL))
    }
  }
}
