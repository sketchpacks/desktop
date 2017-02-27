import {
  API_URL
} from 'config'
const DEFAULT_TIMEOUT = 1500

import axios from 'axios'
import linkHeader from 'parse-link-header'
import qs from 'qs'


const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: DEFAULT_TIMEOUT,
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
