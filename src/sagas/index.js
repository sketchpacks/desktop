import { takeEvery,takeLatest } from 'redux-saga/effects'

import { batchIdentifyPlugins } from './registrySaga'
import { savePreferences } from './preferencesSaga'

export default function* () {
  yield takeEvery('registry/IDENTIFY_PLUGIN_REQUEST', batchIdentifyPlugins)
  yield takeLatest('preferences/UPDATE_SUCCESS', savePreferences)
}
