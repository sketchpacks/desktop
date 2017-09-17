import path from 'path'
import electron from 'electron'

import { delay } from 'redux-saga'
import { fork, select } from 'redux-saga/effects'

import { getPreferences } from 'reducers'

import writePreferences from 'lib/writePreferences'

const preferencesPath = path.join(
  (electron.app || electron.remote.app).getPath('userData'),
  'preferences.json'
)

export function* savePreferences() {
  const preferences = yield select(getPreferences)

  writePreferences(
    preferencesPath,
    preferences,
    () => {}
  )
}
