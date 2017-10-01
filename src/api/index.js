import {
  API_URL,
  REQUEST_TIMEOUT
} from 'config'

import axios from 'axios'
import linkHeader from 'parse-link-header'
import qs from 'qs'

const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: REQUEST_TIMEOUT,
  transformResponse: (data) => JSON.parse(data),
})

class Sketchpacks {
  getUser ({userId}) {
    return client.get(`/users/${userId}`)
  }

  getUserPlugins (endpoint) {
    return axios.request({ url: endpoint, method: 'get', timeout: REQUEST_TIMEOUT })
  }

  getPlugin ({userId, pluginId}) {
    return client.get(`/users/${userId}/plugins/${pluginId}`)
  }

  getPluginById ({pluginId}) {
    return client.get(`/plugins/${pluginId}`)
  }

  getPluginReadme (endpoint) {
    return axios.request({ url: endpoint, method: 'get', timeout: REQUEST_TIMEOUT })
  }

  getCatalog ({query}) {
    return client.get(`/plugins?${query}`)
  }

  getPluginUpdate ({pluginId, version}) {
    return axios.request({
      url: `${API_URL}/v1/plugins/${pluginId}/versions?compare=${version}`,
      method: 'get',
      timeout: REQUEST_TIMEOUT,
    })
  }
}

export let SketchpacksApi = new Sketchpacks()
