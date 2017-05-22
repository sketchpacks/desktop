import { ipcRenderer } from 'electron'
import { importSketchpackRequest,importSketchpackSuccess } from 'reducers/sketchpack'

import { INSTALL_PLUGIN_REQUEST } from 'actions/plugin_manager'

import { difference } from 'lodash'

import {
  installPluginRequest
} from 'reducers/library'

const importMiddleware = store => next => action => {
  next(action)

  if (action.type === importSketchpackRequest.toString()) {
    const newIdentifiers = Object.keys(action.payload.plugins)
    const currentIdentifiers = store.getState().sketchpack.plugins.allIdentifiers

    const ids = difference(newIdentifiers,currentIdentifiers)

    if (ids.length === 0) {
      store.dispatch(
        importSketchpackSuccess({}, {})
      )
      return
    }

    store.dispatch(
      installPluginRequest(ids)
    )
    ipcRenderer.send(INSTALL_PLUGIN_REQUEST,ids)
  }

  if (store.getState().sketchpack.isImporting
    && store.getState().queue.installing.length === 0) {
    store.dispatch(
      importSketchpackSuccess({}, {
        mixpanel: {
          eventName: 'Manage',
          type: 'Import',
          props: {
            source: 'desktop'
          }
        }
      })
    )
  }
}

export default importMiddleware
