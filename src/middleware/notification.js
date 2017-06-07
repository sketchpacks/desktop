import path from 'path'
import { has } from 'lodash'
import { selectPluginBasics } from 'reducers'

const buildMessage = ({ type, name, version }) => {
  switch (type) {
    case "library/FETCH_RECEIVED":
      return `Found ${name} ${version}`
    case "library/UNINSTALL_PLUGIN_SUCCESS":
      return `Removed ${name}`
    case "library/UPDATE_PLUGIN_SUCCESS":
      return `Updated ${name} to v${version}`
    case "library/INSTALL_PLUGIN_SUCCESS":
      return `Installed ${name} v${version}`
    case "manager/INSTALL_ERROR":
      return `Failed to install ${name}`
  }
}

const desktopNotifier = ({ type, title, name, version }) => {
  return new window.Notification('Sketchpacks', {
    silent: true,
    icon: path.join(__dirname, 'src/static/images/icon.png'),
    body: buildMessage({ type, name, version })
  })
}

const notificationMiddleware = store => next => action => {
  const prevState = store
  next(action)
  const nextState = store

  let notification
  let identifier
  let plugin

  if (has(action, 'meta.notification') && action.meta.notification) {
    identifier = action.payload.identifier || action.payload.result || action.payload

    if (action.error) { identifier = action.meta.plugin }

    plugin = selectPluginBasics(nextState.getState(), identifier)

    desktopNotifier({
      type: action.type,
      name: plugin.title,
      version: plugin.version
    })
  }
}

export default notificationMiddleware
