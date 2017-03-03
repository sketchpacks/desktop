import {
  API_URL
} from 'config'
const DEFAULT_TIMEOUT = 1500

import axios from 'axios'
import linkHeader from 'parse-link-header'
import qs from 'qs'
import {pick} from 'lodash'


const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: DEFAULT_TIMEOUT,
  transformResponse: (data) => {
    const jsonData = JSON.parse(data)

    const VALID_KEYS = [
      'id',
      'name',
      'title',
      'description',
      'version',
      'compatible_version',
      'score',
      'watchers_count',
      'stargazers_count',
      'auto_updates',
      'source_url',
      'thumbnail_url',
      'download_url',
      'owner'
    ]

    const transformedData = jsonData.map(p => pick(p, VALID_KEYS))

    return transformedData
  }
})

class Sketchpacks {
  getUser ({userId}) {
    return client.get(`/users/${userId}`)
  }

  getUserPlugins (endpoint) {
    return axios.request({ url: endpoint, method: 'get', timeout: DEFAULT_TIMEOUT })
  }

  getPlugin ({userId, pluginId}) {
    return client.get(`/users/${userId}/plugins/${pluginId}`)
  }

  getPluginReadme (endpoint) {
    return axios.request({ url: endpoint, method: 'get', timeout: DEFAULT_TIMEOUT })
  }

  getCatalog ({query}) {
    return client.get(`/plugins?${query}`)
  }
}

export let SketchpacksApi = new Sketchpacks()
