import {
  API_URL,
} from 'config'

import { ipcRenderer } from 'electron'
import { importSketchpackRequest,importSketchpackSuccess } from 'reducers/sketchpack'

import { INSTALL_PLUGIN_REQUEST } from 'actions/plugin_manager'

import { difference } from 'lodash'
import axios from 'axios'
import { normalize } from 'normalizr'
import * as schemas from 'schemas'
import { addPlugin } from 'reducers/plugins'

import {
  installPluginRequest
} from 'reducers/library'

const DEFAULT_TIMEOUT = 1500
const DEFAULT_BATCH_SIZE = 25

const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: DEFAULT_TIMEOUT,
  transformResponse: (data) => normalize(JSON.parse(data), schemas.pluginListSchema),
  headers: {'Content-Encoding': 'gzip'}
})

const createIdentifierBatches = (identifiers, batch_size) => {
  let results = []

  while (identifiers.length) {
    results.push(
      identifiers.splice(0, batch_size)
    )
  }

  return results
}

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

    createIdentifierBatches(ids,DEFAULT_BATCH_SIZE).forEach(batch => {
      client.get(`${API_URL}/v1/plugins?in=${batch.join(',')}`)
        .then(data => {
          store.dispatch(
            addPlugin(data.data)
          )

          store.dispatch(
            installPluginRequest(data.data.result, {
              import: true
            })
          )
          ipcRenderer.send(INSTALL_PLUGIN_REQUEST,data.data.result)
        })
    })
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
