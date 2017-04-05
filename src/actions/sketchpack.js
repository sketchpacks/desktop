const {
  API_URL
} = require('../config')

const log = require('electron-log')
const ms = require('ms')
const semver = require('semver')
const {filter,find} = require('lodash')

const {sanitizeSemVer} = require('../lib/utils')

const SYNC_REQUEST = 'sync/CHANGE_RECEIVED'
function syncRequest () {
  return (dispatch, getState, {api}) => {

  }
}

const SYNC_FILE_RECEIVED = 'sync/FILE_RECEIVED'
function syncFileReceived (payload) {
  return {
    type: SYNC_FILE_RECEIVED,
    payload
  }
}

const SYNC_CHANGE_RECEIVED = 'sync/CHANGE_RECEIVED'
function syncChangeReceived (payload) {
  return {
    type: SYNC_CHANGE_RECEIVED,
    payload
  }
}

module.exports = {
  SYNC_REQUEST,
  syncRequest,

  SYNC_FILE_RECEIVED,
  syncFileReceived,

  SYNC_CHANGE_RECEIVED,
  syncChangeReceived
}
