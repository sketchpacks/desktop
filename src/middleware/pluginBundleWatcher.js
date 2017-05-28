import log from 'electron-log'
import path from 'path'
import { getInstallPath } from 'lib/utils'

import chokidar from 'chokidar'

const watcher = (watchPath) => {
  log.debug('Watching Library at ', watchPath)
  const libraryWatcher = chokidar.watch(watchPath, {
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
    .on('addDir', (watchPath) => {
      if (path.parse(watchPath).ext === '.sketchplugin') {
        log.debug('Plugin Bundle Detected', watchPath)
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

const pluginBundleWatcher = () => store => {
  watcher('**/(*.sketchplugin|manifest.json)')

  return next => action => {
    next(action)
  }
}

export default pluginBundleWatcher
