/* eslint strict: 0 */
'use strict';

const {
  API_URL,
  APP_VERSION,
  SERVER_PORT,
  SKETCH_TOOLBOX_DB_PATH,
  CATALOG_FETCH_DELAY,
  CATALOG_FETCH_INTERVAL,
  REQUEST_TIMEOUT,
  __PRODUCTION__,
  __DEVELOPMENT__,
  __ELECTRON__
} = require('./src/config')

const pkg = require('./package.json')
const path = require('path')
const os = require('os')
const fs = require('fs')
const {forEach,filter,find,difference,isArray} = require('lodash')
const electron = require('electron')
const {
  app,
  dialog,
  autoUpdater,
  protocol,
  Menu,
  ipcMain,
  ipcRenderer,
  globalShortcut
} = electron
const url = require('url')
const log = require('electron-log')
const menubar = require('menubar')
const axios = require('axios')
const async = require('async')
const {appMenu} = require('./src/menus/appMenu')
const {inputMenu} = require('./src/menus/inputMenu')
const {selectionMenu} = require('./src/menus/selectionMenu')
const chokidar = require('chokidar')
const semver = require('semver')

const Raven = require('raven')

const firstRun = require('first-run')

const appPath = process.platform === 'darwin'
  ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
  : undefined
const AutoLaunch = require('auto-launch')
const autolauncher = new AutoLaunch({
	name: 'Sketchpacks',
  path: appPath,
  isHidden: true
})

const {
  getInstallPath,
  sanitizeSemVer,
  downloadAsset,
  extractAsset,
  removeAsset
} = require('./src/lib/utils')

const writeSketchpack = require('./src/lib/writeSketchpack')
const readSketchpack = require('./src/lib/readSketchpack')
const readPreferences = require('./src/lib/readPreferences')
const readManifest = require('./src/lib/readManifest')

const {
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,
  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_ERROR,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR
} = require('./src/actions/plugin_manager')

Raven.config('https://f20ff15a6de4457890b7754799fe94f7:318b9d5bde6f446aa37e2803555547e4@sentry.io/218116')
  .install()

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 720,
  height: 540,
  index: (__PRODUCTION__ && __ELECTRON__)
    ? `file://${__dirname}/src/dist/index.html`
    : `http://localhost:${SERVER_PORT}/`,
  resizable: false,
  alwaysOnTop: false,
  showOnAllWorkspaces: true,
  preloadWindow: true,
  tooltip: `Sketchpacks ${pkg.version}`,
  backgroundColor: '#f8f9fa'
}

const menuBar = menubar(opts)

let mainWindow
let updater
let externalPluginInstallQueue = []
let libraryWatcher
let sketchpackWatcher

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${APP_VERSION} (${__PRODUCTION__ ? 'PROD' : 'DEV'}) launched`)

  mainWindow.webContents.on('crashed', (err) => {
    Raven.captureException(err)
  })
})

menuBar.on('after-show', () => {
  if (__DEVELOPMENT__) {
    // require('devtron').install()
    menuBar.window.openDevTools({ mode: 'detach' })
  }
})

menuBar.on('after-create-window', () => {
  menuBar.window.hide()
  mainWindow = menuBar.window

  mainWindow.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(mainWindow)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(mainWindow)
    }
  })

  mainWindow.on('focus', () => {
    globalShortcut.register('CommandOrControl+,', () => {
      mainWindow.webContents.send('NAVIGATE_TO', {path: '/preferences'})
    })
  })

  mainWindow.on('blur', () => globalShortcut.unregisterAll())
})

menuBar.on('show', () => {
  let bounds = menuBar.tray.getBounds()
  menuBar.setOption('y', (bounds.y > 0) ? bounds.y * 2 : 0)
})

app.on('ready', () => {
  if (__PRODUCTION__ && __ELECTRON__) {
    updater = require('./src/main/updater')
    updater.init()
  }

  protocol.registerHttpProtocol('sketchpacks', (request, callback) => {
    const uri = url.parse(request.url)
  }, (err) => {
    if (err) Raven.captureException(err)
    if (err) console.error('Failed to register protocol', err)
  })

  Menu.setApplicationMenu(appMenu)
})

app.on('open-url', (event, resource) => {
  event.preventDefault() // Handle event ourselves

  const uri = url.parse(resource)
  const identifier = uri.path.slice(1)

  if (!app.isReady()) {
    externalPluginInstallQueue.push(identifier)
  }
  else {
    mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', [identifier])
  }
})

ipcMain.on('APP_WINDOW_OPEN', (event, arg) => {
  menuBar.showWindow(menuBar.tray.getBounds())
})


ipcMain.on(INSTALL_PLUGIN_REQUEST, (event, plugins) => {
  log.debug(INSTALL_PLUGIN_REQUEST, plugins)
  queueInstall(plugins)
})


ipcMain.on(UPDATE_PLUGIN_REQUEST, (event, plugins) => {
  log.debug(UPDATE_PLUGIN_REQUEST, plugins)
  queueUpdate(plugins)
})

ipcMain.on(UNINSTALL_PLUGIN_REQUEST, (event, plugins) => {
  log.debug(UNINSTALL_PLUGIN_REQUEST, plugins)
  queueRemove(plugins)
})


ipcMain.on('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', (event, arg) => {
  if (externalPluginInstallQueue.length > 0) {
    mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', externalPluginInstallQueue)
    externalPluginInstallQueue = null
  }
})


ipcMain.on('CHECK_FOR_CLIENT_UPDATES', (evt, arg) => {
  const { confirm } = arg
  updater.checkForUpdates(confirm)
})

const getPluginAssetByIdentifier = (identifier) => axios.get(`${API_URL}/v1/plugins/${plugin.identifier}/download`)

const getPluginData = (plugin) => axios.get(`${API_URL}/v1/plugins/${plugin.identifier}`)
const getPluginByIdentifier = (plugin) => {
  return axios.get(`${API_URL}/v1/plugins/${plugin.identifier}`)
}
const getPluginUpdateByIdentifier = (plugin) => axios.get(`${API_URL}/v1/plugins/${plugin.identifier}/download/update/${plugin.version}`)

const installPluginTask = (identifier, callback) => {
  if (typeof identifier === undefined) return

  downloadAsset(Object.assign({},
    {
      identifier: identifier,
      destinationPath: app.getPath('temp'),
      download_url: `${API_URL}/v1/plugins/${identifier}/download`
    }
  ))
    .then(extractAsset)
    .then(result => callback(null))
    .catch(err => {
      log.debug(err.message)
      Raven.captureException(err)
      callback(err)
    })
}

const updatePluginTask = (plugin, callback) => {
  if (typeof plugin === undefined) return

  let updateURL

  if (/^(\=)/.test(plugin.version_range)) {
    updateURL = `${API_URL}/v1/plugins/${plugin.identifier}/download/update/${plugin.installed_version}`
  } else {
    const updateRange = semver.toComparators(plugin.version_range)[0].join(' ')
    updateURL = `${API_URL}/v1/plugins/${plugin.identifier}/download/update/${plugin.installed_version}?range=${updateRange}`
  }

  downloadAsset(Object.assign({},
    plugin,
    {
      destinationPath: app.getPath('temp'),
      download_url: updateURL
    }
  ))
    .then(removeAsset)
    .then(extractAsset)
    .then(result => callback(null, result))
    .catch(err => {
      log.debug(err.message)
      Raven.captureException(err)
      callback(err)
    })
}

const uninstallPluginTask = (plugin, callback) => {
  removeAsset(plugin)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}


const identifyPluginTask = (manifestPath, callback) => {
  const manifest_path = manifestPath
  let install_path
  let identifier
  let version
  let name

  let unidentifiedPlugin

  const buildPlugin = (manifestContents) => new Promise((resolve,reject) => {
    try {
      install_path = manifestContents.install_path
      version = sanitizeSemVer(manifestContents.version || "0.0.0")
      name = manifestContents.name,
      identifier = manifestContents.identifier

      unidentifiedPlugin = {
        identifier,
        name,
        version,
        install_path,
        manifest_path
      }

      callback(null, unidentifiedPlugin)
      resolve(unidentifiedPlugin)
    } catch (err) {
      log.error('buildPlugin', err)
      Raven.captureException(err)
      reject(err)
    }
  })

  readManifest(manifest_path)
    .then(buildPlugin)
}


const triageTask = (task, callback) => {
  const { action,payload } = task

  switch (action) {
    case 'install':
      return installPluginTask(payload,callback)
    case 'update':
      return updatePluginTask(payload,callback)
    case 'remove':
      return uninstallPluginTask(payload,callback)
    case 'identify':
      return identifyPluginTask(payload,callback)
  }
}

const WORK_QUEUE_CONCURRENCY = 1
const workQueue = async.queue((task, callback) => triageTask(task, callback), WORK_QUEUE_CONCURRENCY)

workQueue.drain = () => {
  log.debug('Work queue drained')
}

const queueInstall = (identifiers) => {
  if (typeof identifiers === undefined) return

  const ids = isArray(identifiers) ? identifiers : [identifiers]
  if (ids.length === 0) return

  log.debug(`Enqueueing ${ids.length} plugins`)

  ids.map(id => workQueue.push({ action: 'install', payload: id }, (err, result) => {
    if (err) {
      mainWindow.webContents.send(INSTALL_PLUGIN_ERROR, err.message, id)
      return
    }

    mainWindow.webContents.send('library/INSTALL_PLUGIN_SUCCESS', id)
  }))
}

const queueUpdate = (plugins) => {
  const items = [].concat(plugins)

  if (typeof items === undefined) return
  if (items.length === 0) return

  log.debug(`Enqueueing ${items.length} plugins`)
  items.map(plugin => workQueue.push({ action: 'update', payload: plugin }, (err, result) => {
    if (err) {
      log.error(err)
      Raven.captureException(err)
      return
    }
    log.debug('Update complete', result)
    mainWindow.webContents.send('library/UPDATE_PLUGIN_SUCCESS', result)
  }))
}

const queueRemove = (plugins) => {
  const items = [].concat(plugins)

  if (typeof items === undefined) return
  if (items.length === 0) return

  log.debug(`Enqueueing ${items.length} plugins`)
  items.map(plugin => workQueue.push({ action: 'remove', payload: plugin }, (err, result) => {
    if (err) {
      log.error(err)
      Raven.captureException(err)
      return
    }
    log.debug('Uninstall complete', result)
    mainWindow.webContents.send(UNINSTALL_PLUGIN_SUCCESS, result)
  }))
}

const queueSync = (sketchpackContents) => {
  workQueue.push({ action: 'sync', payload: sketchpackContents }, (err, result) => {
    if (err) {
      log.error(err)
      Raven.captureException(err)
      return
    }
    mainWindow.webContents.send('sketchpack/SYNC', sketchpackContents)
  })
}

const queueIdentify = (plugins) => {
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'identify', payload: plugin }, (err, result) => {
    log.debug('queueIdentify', result)
    if (typeof result !== undefined) {
      mainWindow.webContents.send('PLUGIN_DETECTED', result)
    }
  }))
}


ipcMain.on('sketchpack/IMPORT_REQUEST', (event, args) => {
  dialog.showOpenDialog(null, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Sketchpack',
        extensions: ['sketchpack']
      }
    ]
  }, (filePaths) => {
    if (filePaths) {
      readSketchpack(filePaths[0])
        .then(contents => {
          if (contents.schema_version === "1.0.0") {
            mainWindow.webContents.send('sketchpack/IMPORT', contents)
            return
          } else {
            const opts = {
              type: 'info',
              title: 'Import failed',
              message: 'Import failed',
              detail: "Can't import sketchpacks with outdated schema versions",
              buttons: ['Ok'],
              defaultId: 0
            }

            dialog.showMessageBox(opts)
          }
        })
        .catch(err => {
          log.debug(err)
          Raven.captureException(err)
        })
    }
  })
})


ipcMain.on('sketchpack/EXPORT_REQUEST', (event, args) => {
  try {
    dialog.showSaveDialog(null, {
      nameFieldLabel: 'my-library',
      extensions: ['sketchpack'],
      defaultPath: path.join(app.getPath('desktop'),'my-library.sketchpack'),
      message: 'Export My Library',
      buttonLabel: 'Export',
      tags: false,
      title: 'Export My Library'
    }, (filepath) => {
      if (filepath) mainWindow.webContents.send('sketchpack/EXPORT', filepath)
    })
  } catch (err) {
    log.error(err)
    Raven.captureException(err)
    if (err) mainWindow.webContents.send('sketchpack/EXPORT_ERROR')
  }
})

ipcMain.on('SELECT_FILE', (event, caller) => {
  try {
    dialog.showOpenDialog(null, {
      properties: ['openFile'],
      filters: [
        {
          name: 'Sketchpack',
          extensions: ['sketchpack']
        }
      ]
    }, (filePaths) => {
      if (filePaths) {
        try {
          mainWindow.webContents.send('SET_PREFERENCE', {
            path: 'sketchpack.location',
            value: filePaths[0]
          })
        } catch (err) {
          log.error(err)
        }
      }
    })
  } catch (err) {
    Raven.captureException(err)
    log.error(err)
  }
})

process.on('uncaughtException', (err) => {
  Raven.captureException(err)
  log.error(err)
})


if (firstRun({name: pkg.name})) {
  autolauncher.enable()
}


const watchLibrary = (watchPath) => {
  log.debug('Watching Library at ', watchPath)
  libraryWatcher = chokidar.watch(watchPath, {
    ignored: /[\/\\]\./,
    persistent: true,
    cwd: path.normalize(getInstallPath().replace(/\\/g, ''))
  })

  const onWatcherReady = () => {
    log.info('From here can you check for real changes, the initial scan has been completed.')
  }

  libraryWatcher
    .on('add', (watchPath) => {
      if (path.parse(watchPath).base === 'manifest.json') {
        log.debug('Manifest Detected', watchPath)
        let manifestPath = path.join(getInstallPath().replace(/\\/g, ''),watchPath)
        queueIdentify([manifestPath])
      }
    })
    .on('addDir', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchplugin') {
        log.debug('Plugin Bundle Detected', watchPath)
      }
    })
    .on('change', (watchPath) => {
      if (path.parse(watchPath).base === 'manifest.json') {
        log.debug('Manifest Changed', watchPath)
      }
    })
    .on('unlink', (watchPath) => {
      if (path.parse(watchPath).base === 'manifest.json') {
        log.debug('Manifest Removed', watchPath)
      }
    })
    .on('unlinkDir', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchplugin') {
        log.debug('Plugin Bundle Removed', watchPath)
      }
    })
    .on('error', (err) => {
      Raven.captureException(err)
      log.debug('Error happened', err)
    })
    .on('ready', onWatcherReady)
}

ipcMain.on('sketchpack/CHANGE', (event, arg) => {
  sketchpackWatcher.close()

  sketchpackWatcher = ''

  watchSketchpack(arg)

  log.info('sketchpack/CHANGE', sketchpackWatcher.getWatched())
})

const watchSketchpack = (watchPath) => {
  log.debug('Watching Sketchpack at ', watchPath)
  sketchpackWatcher = chokidar.watch(watchPath, {
    ignored: /[\/\\]\./,
    persistent: true
  })

  const onWatcherReady = () => {
    log.info('From here can you check for real changes, the initial scan has been completed.')
  }

  sketchpackWatcher
    .on('add', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchpack') {
        log.debug('Sketchpack Detected', watchPath)

        readSketchpack(watchPath)
          .then(contents => mainWindow.webContents.send('sketchpack/SYNC_REQUEST', contents))
          .catch(err => log.debug(err))
      }
    })
    .on('change', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchpack') {
        log.debug('Sketchpack Changed', watchPath)

        readSketchpack(watchPath)
          .then(contents => mainWindow.webContents.send('sketchpack/SYNC_REQUEST', contents))
          .catch(err => log.debug(err))
      }
    })
    .on('unlink', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchpack') {
        log.debug('Sketchpack Removed', watchPath)
      }
    })
    .on('error', (err) => {
      Raven.captureException(err)
      log.debug('Error happened', err)
    })
    .on('ready', onWatcherReady)
}

setTimeout(() => {
  const preferencesPath = path.join(
    app.getPath('userData'),
    'preferences.json'
  )

  if (fs.existsSync(preferencesPath)) {
    readPreferences(preferencesPath)
      .then(contents => {
        log.debug(contents)
        watchSketchpack(contents.sketchpack.location)
      })
      .catch(err => log.debug(err))
  }
}, 1000)

setTimeout(() => {
  watchLibrary('**/(*.sketchplugin|manifest.json)')
}, 1000)

app.on('before-quit', () => {
  log.info('Watcher stopped')
  libraryWatcher.close()
  sketchpackWatcher.close()
})
