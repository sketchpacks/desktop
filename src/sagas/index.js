import { takeEvery } from 'redux-saga/effects'

import { batchIdentifyPlugins } from './registrySaga'

export default function* () {
  yield takeEvery('registry/IDENTIFY_PLUGIN_REQUEST', batchIdentifyPlugins)
}
