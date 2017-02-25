import {
  API_URL
} from 'config'

import axios from 'axios'
import linkHeader from 'parse-link-header'
import qs from 'qs'

const client = axios.create({
  baseURL: `${API_URL}/v1`,
  timeout: 1500,
})

class Sketchpacks {
  getUser ({userId}) {
    return client.get(`/users/${userId}`)
  }

  getPlugin ({userId, pluginId}) {
    return client.get(`/users/${userId}/plugins/${pluginId}`)
  }

  getPluginReadme ({pluginId}) {
    return client.get(`/plugins/${pluginId}/readme`)
  }

  getCatalog ({query}) {
    return client.get(`/plugins?${query}`)
  }
}

export let SketchpacksApi = new Sketchpacks()
