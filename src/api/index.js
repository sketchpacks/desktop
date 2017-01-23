import axios from 'axios'
import linkHeader from 'parse-link-header'
import qs from 'qs'

const client = axios.create({
  baseURL: 'https://sketchpacks-api.herokuapp.com/v1/',
  timeout: 1500,
  responseType: 'json',
})

class SketchpacksApi {
  constructor () {
    console.log('hello')
  }
}

export let Sketchpacks = new SketchpacksApi()
