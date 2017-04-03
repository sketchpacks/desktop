const {
  API_URL
} = require('../config')

const log = require('electron-log')
const ms = require('ms')
const semver = require('semver')
const {filter,find} = require('lodash')

const {sanitizeSemVer} = require('../lib/utils')

export const SYNC_REQUEST = 'sync/CHANGE_RECEIVED'
export function syncRequest () {
  return (dispatch, getState, {api}) => {

  }
}

export const SYNC_FILE_RECEIVED = 'sync/FILE_RECEIVED'
export function syncFileReceived (payload) {
  return {
    type: SYNC_FILE_RECEIVED,
    padyload
  }
}

export const SYNC_CHANGE_RECEIVED = 'sync/CHANGE_RECEIVED'
export function syncChangeReceived (payload) {
  return {
    type: SYNC_CHANGE_RECEIVED,
    padyload
  }
}
