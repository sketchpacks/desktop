import path from 'path'
import { has } from 'lodash'
import { selectPlugin } from 'reducers'

const buildMessage = ({ type, name, version }) => {
  switch (type) {
    case "library/FETCH_RECEIVED":
      return `${name} ${version} added`
    case "library/UNINSTALL_PLUGIN_SUCCESS":
      return `${name} removed`
    case "library/UPDATE_PLUGIN_SUCCESS":
      return `${name} updated to ${version}`
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
  if (has(action, 'meta.notification')) {
    const { message, title } = action.meta.notification
    const plugin = selectPlugin(store.getState(),action.payload.result)

    desktopNotifier({
      type: action.type,
      name: plugin.title,
      version: plugin.installed_version
    })
  }
}

export default notificationMiddleware
