import path from 'path'
import { has } from 'lodash'

const notificationMiddleware = store => next => action => {
  const prevState = store
  next(action)
  const nextState = store

  let notification
  if (has(action, 'meta.notification')) {
    const { message, title } = action.meta.notification

    const notification = new window.Notification('Sketchpacks', {
      silent: true,
      icon: path.join(__dirname, 'src/static/images/icon.png'),
      body: message
    })
  }
}

export default notificationMiddleware
