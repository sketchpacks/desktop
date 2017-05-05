import { API_URL } from 'config'
import { ipcRenderer } from 'electron'
import path from 'path'
import { reduce,pick } from 'lodash'
import readSketchpack from 'lib/readSketchpack'
import { selectPlugin } from 'reducers'
import { importSketchpackRequest,importSketchpackSuccess } from 'reducers/sketchpack'
import axios from 'axios'
import { normalize } from 'normalizr'
import * as schemas from 'schemas'

import { INSTALL_PLUGIN_REQUEST } from 'actions/plugin_manager'

import {
  getSketchpackIdentifiers,
  syncSketchpackContents
} from 'reducers'

const DEFAULT_TIMEOUT = 1500
const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: DEFAULT_TIMEOUT,
  transformResponse: (data) => normalize(JSON.parse(data), schemas.pluginListSchema)
})

const importMiddleware = store => next => action => {
  next(action)

  if (action.type === importSketchpackRequest.toString()) {
    readSketchpack(action.payload)
      .then(contents => Object.keys(contents.plugins))
      .then(ids => ipcRenderer.send(INSTALL_PLUGIN_REQUEST,ids))
  }
}

export default importMiddleware
