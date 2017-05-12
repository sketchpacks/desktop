/* eslint strict: 0 */
'use strict';

const {
  API_URL,
  APP_VERSION,
  SERVER_PORT,
  SKETCH_TOOLBOX_DB_PATH,
  CATALOG_FETCH_DELAY,
  CATALOG_FETCH_INTERVAL,
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
  ipcRenderer
} = electron
const url = require('url')
const log = require('electron-log')
const menubar = require('menubar')
const dblite = require('dblite')
const axios = require('axios')
const async = require('async')
const {appMenu} = require('./src/menus/appMenu')
const {inputMenu} = require('./src/menus/inputMenu')
const {selectionMenu} = require('./src/menus/selectionMenu')
const chokidar = require('chokidar')

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

const opts = {
  dir: __dirname,
  icon: __dirname + '/src/IconTemplate.png',
  width: 720,
  height: 540,
  index: (__PRODUCTION__ && __ELECTRON__) ? `file://${__dirname}/src/dist/index.html` : `http://localhost:${SERVER_PORT}/`,
  resizable: false,
  alwaysOnTop: false,
  showOnAllWorkspaces: true,
  preloadWindow: true,
  tooltip: `Sketchpacks v${pkg.version} beta`,
  backgroundColor: '#f8f9fa',
}

const menuBar = menubar(opts)

let mainWindow
let updater
let externalPluginInstallQueue = []
let libraryWatcher
let sketchpackWatcher

menuBar.on('ready', () => {
  log.info(`Sketchpacks v${APP_VERSION} (${__PRODUCTION__ ? 'PROD' : 'DEV'}) launched`)
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
  }, (error) => {
    if (error) console.error('Failed to register protocol', error)
  })

  Menu.setApplicationMenu(appMenu)
})

app.on('open-url', (event, resource) => {
  event.preventDefault() // Handle event ourselves

  const uri = url.parse(resource)
  const pluginId = uri.path.slice(1)

  if (!app.isReady()) {
    externalPluginInstallQueue.push(pluginId)
  }
  else {
    // TODO: User pretty namespaces in place of pluginID
    mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', pluginId)
  }
})

ipcMain.on('APP_WINDOW_OPEN', (event, arg) => {
  menuBar.showWindow(menuBar.tray.getBounds())
})


ipcMain.on(INSTALL_PLUGIN_REQUEST, (event, plugins) => {
  log.debug(INSTALL_PLUGIN_REQUEST, plugins)
  queueInstall(plugins)
})


ipcMain.on(UPDATE_PLUGIN_REQUEST, (event, arg) => {
  log.debug(UPDATE_PLUGIN_REQUEST, arg)
  queueUpdate([arg])
})

ipcMain.on(UNINSTALL_PLUGIN_REQUEST, (event, arg) => {
  log.debug(UNINSTALL_PLUGIN_REQUEST, arg)
  queueRemove([arg])
})


ipcMain.on('CHECK_FOR_EXTERNAL_PLUGIN_INSTALL_REQUEST', (event, arg) => {
  if (externalPluginInstallQueue.length > 0) {
    forEach(externalPluginInstallQueue, (pluginId) => {
      mainWindow.webContents.send('EXTERNAL_PLUGIN_INSTALL_REQUEST', pluginId)
    })
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
      callback(err)
    })
}

const updatePluginTask = (plugin, callback) => {
  if (typeof plugin === undefined) return

  downloadAsset(Object.assign({},
    plugin,
    {
      destinationPath: app.getPath('temp'),
      download_url: `${API_URL}/v1/plugins/${plugin.identifier}/download/update/${plugin.installed_version}`
    }
  ))
    .then(removeAsset)
    .then(extractAsset)
    .then(result => callback(null, result))
    .catch(err => {
      log.debug(err.message)
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

  let unidentifiedPlugin

  const buildPlugin = (manifestContents) => new Promise((resolve,reject) => {
    try {
      install_path = manifestContents.install_path
      version = sanitizeSemVer(manifestContents.version || "0.0.0")
      unidentifiedPlugin = {
        identifier: manifestContents.identifier,
        name: manifestContents.name,
        owner: {
          handle: manifestContents.name || manifestContents.author || manifestContents.authorName
        },
        version: version,
        install_path,
        manifest_path
      }
      resolve(unidentifiedPlugin)
    } catch (err) {
      log.error('buildPlugin', err)
      reject(err)
    }
  })

  readManifest(manifest_path)
    .then(buildPlugin)
    .then(getPluginByIdentifier)
    .then(response => {
      const data = Object.assign({}, response.data, { install_path, manifest_path, version })
      callback(null, data)
    },
    err => {
      const error = new Error(`Failed to identify plugin - ${manifest_path}`)
      const data = Object.assign({}, { install_path, manifest_path, version })
      callback(error, data)
    })
    .catch(err => {
      log.error('Failed to identify plugin: ', err)
      callback(null, unidentifiedPlugin)
    })
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
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'update', payload: plugin }, (err, result) => {
    if (err) {
      log.error(err)
      return
    }
    log.debug('Update complete', result)
    mainWindow.webContents.send('library/UPDATE_PLUGIN_SUCCESS', result.plugin)
  }))
}

const queueRemove = (plugins) => {
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'remove', payload: plugin }, (err, result) => {
    if (err) return
    log.debug('Uninstall complete', result)
    mainWindow.webContents.send(UNINSTALL_PLUGIN_SUCCESS, result)
  }))
}

const queueSync = (sketchpackContents) => {
  workQueue.push({ action: 'sync', payload: sketchpackContents }, (err, result) => {
    if (err) {
      log.error(err)
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
      try {
        readSketchpack(filePaths[0])
          .then(contents => mainWindow.webContents.send('sketchpack/IMPORT', contents))
      } catch (err) {
        log.error(err)
      }
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
    if (err) mainWindow.webContents.send('sketchpack/EXPORT_ERROR')
  }
})

process.on('uncaughtException', (err) => {
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
    .on('error', (error) => {
      log.debug('Error happened', error)
    })
    .on('ready', onWatcherReady)
}

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
      }
    })
    .on('change', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchpack') {
        log.debug('Sketchpack Changed', watchPath)

        readSketchpack(watchPath)
          .then(contents => mainWindow.webContents.send('sketchpack/SYNC_REQUEST', contents))
      }
    })
    .on('unlink', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchpack') {
        log.debug('Sketchpack Removed', watchPath)
      }
    })
    .on('error', (error) => {
      log.debug('Error happened', error)
    })
    .on('ready', onWatcherReady)
}

setTimeout(() => {
  const librarySketchpackPath = path.join(app.getPath('userData'),'my-library.sketchpack')
  watchSketchpack(librarySketchpackPath)
}, 1000)

setTimeout(() => {
  watchLibrary('**/(*.sketchplugin|manifest.json)')
}, 1000)

app.on('before-quit', () => {
  log.info('Watcher stopped')
  libraryWatcher.close()
  sketchpackWatcher.close()
})
