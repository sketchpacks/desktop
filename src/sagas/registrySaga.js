import {
  API_URL,
} from 'config'

import { delay } from 'redux-saga'
import { call, cancel, fork, put, take, all } from 'redux-saga/effects'
import axios from 'axios'
import { normalize } from 'normalizr'
import * as schemas from 'schemas'

const DEFAULT_TIMEOUT = 1500
const DEFAULT_BATCH_SIZE = 10

const identifiers = {}
const tasks = {}

const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: DEFAULT_TIMEOUT,
  transformResponse: (data) => normalize(JSON.parse(data), schemas.pluginListSchema)
})

const fetchPluginsByIdentifier = (identifiers) => client
  .get(`${API_URL}/v1/plugins?in=${identifiers.join(',')}`)
  .then(data => data.data)

const createBatches = (items, size) => {
  let results = []

  while (items.length) {
    results.push(items.splice(0, size))
  }

  return results
}

function* identifyPluginsByBatch(resource) {
  yield call(delay, 1000)

  const batches = createBatches(Object.keys(identifiers[resource]),10)

  yield all(batches.map(identifiers => fork(fetchPlugins,identifiers)))

  delete identifiers[resource]
  delete tasks[identifiers]
}

function* fetchPlugins(identifiers) {
  try {
    const data = yield call(fetchPluginsByIdentifier, identifiers)

    if (data.result) {
      yield put({
        type: 'registry/IDENTIFY_PLUGINS_SUCCESS',
        payload: data
      })
    }
  } catch (err) {
    yield put({
      type: 'registry/IDENTIFY_PLUGINS_ERROR',
      err
    })
  }
}

export function* batchIdentifyPlugins({ payload }) {
  const { plugin, resource } = payload
  const { identifier } = plugin

  if (!identifiers[resource]) {
    identifiers[resource] = {}
  }

  yield put({
    type: 'library/PLUGIN_DETECTED',
    payload: { plugin }
  })

  identifiers[resource][identifier] = true

  if (tasks[resource]) {
    yield cancel(tasks[resource])
  }

  tasks[resource] = yield fork(identifyPluginsByBatch, resource)
}
