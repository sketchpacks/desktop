import path from 'path'

import { delay } from 'redux-saga'
import { fork, select } from 'redux-saga/effects'

import { getPreferences } from 'reducers'

import writePreferences from 'lib/writePreferences'

export function* savePreferences() {
  const state = yield select(getPreferences)

  console.log(state)
}
