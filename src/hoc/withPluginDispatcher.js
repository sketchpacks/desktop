import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import {remote} from 'electron'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  installPluginRequest,
  updatePluginRequest,
  toggleVersionLockRequest,
} from 'actions/plugin_manager'

import {
  updatePlugin,
  removePlugin
} from 'reducers/library'

import {
  setVersionRange
} from 'reducers/sketchpack'

const withPluginDispatcher = (WrappedComponent) => {
  class ConnectedComponent extends Component {
    constructor (props) {
      super(props)

      this.handlePluginEvent = this.handlePluginEvent.bind(this)
    }

    handlePluginEvent ({ type, plugin, author, isLocked, lock_strength, identifier, version }) {
      const {dispatch} = this.props

      switch (type) {
        case "install":
          return dispatch(installPluginRequest(plugin.identifier))
        case "remove":
          return dispatch(removePlugin(plugin))
        case "update":
          return dispatch(updatePlugin(plugin))
        case "lock":
          return dispatch(setVersionRange({
            identifier,
            version,
            lock_strength
          }, {
            mixpanel: {
              eventName: 'Manage',
              type: 'Version Range',
              props: {
                source: 'desktop',
                pluginId: identifier,
                lock: lock_strength,
                version
              }
            }
          }))
        case "info":
          return remote.shell.openExternal(`${WEB_URL}/${plugin.owner.handle}/${plugin.name}`)
        case "author":
          return remote.shell.openExternal(`${WEB_URL}/@${plugin.owner.handle}`)
      }
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          handlePluginEvent={this.handlePluginEvent}
        />
      )
    }
  }

  const mapStateToProps = (state,ownProps) => state

  return connect(mapStateToProps)(ConnectedComponent)
}

export default withPluginDispatcher
