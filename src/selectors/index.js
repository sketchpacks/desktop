import { createSelector } from 'reselect'
const {reduce} = require('lodash')
import {sanitizeSemVer} from '../lib/utils'

import { getLibrary } from 'reducers/library'

export const getReducedLibrary = createSelector(
  [ getLibrary ], (plugins) => reduce(plugins, ((result, value, key) => {
    result[`${value.owner.handle}/${value.name}`] = {
      name: value.name,
      owner: value.owner.handle,
      version: sanitizeSemVer(value.version),
      compatible_version: sanitizeSemVer(value.compatible_version),
    }

    return result
  }), {})
)
