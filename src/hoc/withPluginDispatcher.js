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
  uninstallPluginRequest,
  toggleVersionLockRequest,
} from 'actions/plugin_manager'

const withPluginDispatcher = (WrappedComponent) => {
  class ConnectedComponent extends Component {
    constructor (props) {
      super(props)

      this.handlePluginEvent = this.handlePluginEvent.bind(this)
    }

    handlePluginEvent ({ type, plugin, author, isLocked }) {
      const {dispatch} = this.props

      switch (type) {
        case "install":
          return dispatch(installPluginRequest(plugin))
        case "remove":
          return dispatch(uninstallPluginRequest(plugin))
        case "update":
          return dispatch(updatePluginRequest(plugin))
        case "lock":
          return dispatch(setVersionRange({
            namespace: `${plugin.owner.handle}/${plugin.name}`,
            identifier: plugin.identifier,
            version: plugin.version,
            compatible_version: plugin.compatible_version
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
