import {remote} from 'electron'
import path from 'path'
import Database from 'nedb'

import Catalog from 'lib/catalog'

let database = new Database({
  filename: path.join(remote.app.getPath('userData'), 'catalog.db'),
  autoload: true
})
Catalog.setDatabase(database)

window.Catalog = Catalog
