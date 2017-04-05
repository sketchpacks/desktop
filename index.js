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
const {forEach,filter,find,difference} = require('lodash')
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater
const protocol = electron.protocol
const url = require('url')
const {ipcMain, ipcRenderer} = electron
const log = require('electron-log')
const menubar = require('menubar')
const dblite = require('dblite')
const axios = require('axios')
const async = require('async')
const chokidar = require('chokidar')

const firstRun = require('first-run')
const AutoLaunch = require('auto-launch')
const autolauncher = new AutoLaunch({
	name: 'Sketchpacks'
})

const writeSketchpack = require('./src/lib/writeSketchpack')
const readSketchpack = require('./src/lib/readSketchpack')
const readLibrary = require('./src/lib/readLibrary')
const PluginManager = require('./src/main/plugin_manager')
const {
  getInstallPath,
  extractAsset,
  downloadAsset,
  removeAsset,
  sanitizeSemVer
} = require('./src/lib/utils')

const {
  INSTALL_PLUGIN_REQUEST,
  INSTALL_PLUGIN_SUCCESS,
  INSTALL_PLUGIN_ERROR,
  UPDATE_PLUGIN_REQUEST,
  UPDATE_PLUGIN_SUCCESS,
  UPDATE_PLUGIN_ERROR,
  UNINSTALL_PLUGIN_REQUEST,
  UNINSTALL_PLUGIN_SUCCESS,
  UNINSTALL_PLUGIN_ERROR,
  TOGGLE_VERSION_LOCK_REQUEST,
  TOGGLE_VERSION_LOCK_SUCCESS,
  TOGGLE_VERSION_LOCK_ERROR
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
let watcher

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


ipcMain.on(INSTALL_PLUGIN_REQUEST, (event, arg) => {
  log.debug(INSTALL_PLUGIN_REQUEST, arg)
  const p = { owner: arg.owner.handle, name: arg.name }
  queueInstall([p])
})


ipcMain.on(UPDATE_PLUGIN_REQUEST, (event, arg) => {
  log.debug(UPDATE_PLUGIN_REQUEST, arg)
  const p = { owner: arg.owner.handle, name: arg.name }
  queueUpdate([p])
})

ipcMain.on(UNINSTALL_PLUGIN_REQUEST, (event, arg) => {
  log.debug(UNINSTALL_PLUGIN_REQUEST, arg)
  queueRemove([arg])
})


ipcMain.on(TOGGLE_VERSION_LOCK_REQUEST, (event, args) => {
  mainWindow.webContents.send(TOGGLE_VERSION_LOCK_REQUEST, args)
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

const getPluginData = (plugin) => axios.get(`${API_URL}/v1/users/${plugin.owner}/plugins/${plugin.name.toLowerCase()}`)

const installPluginTask = (plugin, callback) => {
  getPluginData(plugin)
    .then(response => downloadAsset({
      plugin: response.data,
      destinationPath: app.getPath('temp'),
      onProgress: (received,total) => {
        let percentage = (received * 100) / total;
        // log.debug(percentage + "% | " + received + " bytes out of " + total + " bytes.")
      }
    }))
    .then(extractAsset)
    .then(result => callback(null, result.plugin))
    .catch(err => {
      log.error('Error while installing: ', err)
      callback(err)
    })
}

const updatePluginTask = (plugin, callback) => {
  getPluginData(plugin)
    .then(response => downloadAsset({
      plugin: response.data,
      destinationPath: app.getPath('temp')
    }))
    .then(removeAsset)
    .then(extractAsset)
    .then(result => callback(null, result.plugin))
    .catch(err => {
      log.error('Error while updating: ', err)
      callback(err)
    })
}

const uninstallPluginTask = (plugin, callback) => {
  removeAsset({ plugin: plugin })
    .then(result => callback(null, result.plugin))
    .catch(err => callback(err))
}

function denormalizePlugins (plugins) {
	return new Promise ((resolve, reject) => {
  	try {
      let denormalized = plugins.map(plugin => {
      	return {
        	name: plugin.name,
          owner: plugin.owner.handle,
          version: plugin.version,
          compatible_version: plugin.compatible_version
        }
      })
      log.debug('denormalizePlugins',denormalized)
      resolve(denormalized)
    } catch (err) {
    	reject(err)
    }
  })
}

function mapSketchpack (plugins) {
	return new Promise ((resolve, reject) => {
  	try {
      resolve(plugins)
    } catch (err) {
    	reject(err)
    }
  })
}

function getPluginNamespace (plugins) {
	return new Promise((resolve, reject) => {
  	try {
    	const namespaces = plugins.map(plugin => `${plugin.owner}/${plugin.name}`)
      log.debug('getPluginNamespace',namespaces)
      resolve(namespaces)
    } catch (err) {
    	reject(err)
    }
  })
}

const syncTask = (sketchpack, callback) => {
  readLibrary(path.join(app.getPath('userData'),'library.json'))
    .then(library => {
      const denormalizedLibrary = denormalizePlugins(library)
      	.then(getPluginNamespace)

      const mappedSketchpack = mapSketchpack(sketchpack)
      	.then(getPluginNamespace)

      Promise.all([mappedSketchpack,denormalizedLibrary])
        .then(results => callback(null, results))
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
    case 'sync':
      return syncTask(payload,callback)
  }
}

const workQueue = async.queue((task, callback) => triageTask(task, callback), 2)

workQueue.drain = () => {
  log.debug('Work Complete')
}

const queueInstall = (plugins) => {
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'install', payload: plugin }, (err, result) => {
    if (err) {
      mainWindow.webContents.send(INSTALL_PLUGIN_ERROR, err, plugin)
      return callback(err)
    }
    log.debug('Install complete', result.name)
    mainWindow.webContents.send(INSTALL_PLUGIN_SUCCESS, result)
  }))
}

const queueUpdate = (plugins) => {
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'update', payload: plugin }, (err, result) => {
    if (err) return callback(err)
    log.debug('Update complete', result)
    mainWindow.webContents.send(UPDATE_PLUGIN_SUCCESS, result.plugin)
  }))
}

const queueRemove = (plugins) => {
  if (typeof plugins === undefined) return
  if (plugins.length === 0) return

  log.debug(`Enqueueing ${plugins.length} plugins`)
  plugins.map(plugin => workQueue.push({ action: 'remove', payload: plugin }, (err, result) => {
    if (err) return callback(err)
    log.debug('Uninstall complete', result)
    mainWindow.webContents.send(UNINSTALL_PLUGIN_SUCCESS, result)
  }))
}

const queueSync = (sketchpackContents) => {
  workQueue.push({ action: 'sync', payload: sketchpackContents }, (err, result) => {
    if (err) return callback(err)

    const diff = difference(result[0],result[1])
    const installables = diff.map(plugin => {
      let owner = plugin.split('/')[0]
      let name = plugin.split('/')[1]

      return find(sketchpackContents, (o) => {
        return o.name === name && o.owner === owner
      })
    })
    
    queueInstall(installables)
  })
}


const importFromSketchToolbox = (dbPath) => {
  const db = dblite(dbPath)

  db.query('SELECT ZDIRECTORYNAME,ZNAME,ZOWNER FROM ZPLUGIN WHERE ZSTATE = 1', {directory_name: String, slug: String, owner: String}, (rows) => {
    if (rows.length === 0) return

    const importables = []
    const removables = []

    rows.forEach(plugin => importables.push({
      owner: row.owner,
      name: row.slug,
      install_path: path.join(getInstallPath(),row.directory_name.replace(/ /g, '\\ '))
    }))

    queueInstall(importables)
    queueRemove(removables)

    db.close()
  })
}


ipcMain.on('IMPORT_FROM_SKETCH_TOOLBOX', (event, args) => {
  const homepath = os.homedir()
  const dbPath = path.join(homepath, SKETCH_TOOLBOX_DB_PATH)

  if (fs.existsSync(dbPath)) {
    dialog.showMessageBox(null, {
      buttons: ['Cancel', 'Import plugins'],
      defaultId: 1,
      cancelId: 0,
      message: '🚚 Import from Sketch Toolbox',
      detail: 'Import installed plugins from Sketch Toolbox. Plugins not found in the Sketchpacks Registry will be excluded.',
    }, (response, checkboxChecked) => {
      if (response) importFromSketchToolbox(dbPath)
    })
  }
  else {
    dialog.showMessageBox(null, {
      buttons: ['Ok'],
      defaultId: 0,
      cancelId: 0,
      message: '🤔 Import Failed',
      detail: 'We had trouble finding the location of Sketch Toolbox. No plugins were imported.',
    }, (response, checkboxChecked) => {})
  }
})


ipcMain.on('IMPORT_FROM_SKETCHPACK', (event, args) => {
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
          .then(plugins => queueInstall(plugins))
      } catch (err) {
        log.error(err)
      }

    }

  })
})


ipcMain.on('EXPORT_LIBRARY', (event, libraryContents) => {
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
      if (libraryContents.length === 0) return

      log.info(`My Library exported to ${filepath}`)

      if (filepath) writeSketchpack(filepath,libraryContents)
    })
  } catch (err) {
    log.error(err)
  }
})

process.on('uncaughtException', (err) => {
  log.error(err)
})


if (firstRun({name: pkg.name})) {
  autolauncher.enable()
}


const watch = (path) => {
  log.debug('Watching ', path)
  const watcher = chokidar.watch(path, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    followSymlinks: true
  })

  watcher.on('change', (path, stats) => {
    log.debug('Change detected: ', path)

    readSketchpack(path)
      .then(contents => queueSync(contents))
      .catch(err => log.debug(err))
  })
}

watch(path.join(app.getPath('userData'),'my-library.sketchpack'))

app.on('before-quit', () => {
  log.info('Watcher stopped')
  watcher.close()
})
