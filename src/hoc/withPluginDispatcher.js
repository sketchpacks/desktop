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
  removePlugin
} from 'reducers/library'

import {
  setVersionRange
} from 'reducers/sketchpack'

import {
  toggleSemverLock
} from 'lib/utils'

const withPluginDispatcher = (WrappedComponent) => {
  class ConnectedComponent extends Component {
    constructor (props) {
      super(props)

      this.handlePluginEvent = this.handlePluginEvent.bind(this)
    }

    handlePluginEvent ({ type, plugin, author, isLocked }) {
      const {dispatch} = this.props

      console.log('handlePluginEvent',type)

      switch (type) {
        case "install":
          return dispatch(installPluginRequest(plugin))
        case "remove":
          return dispatch(removePlugin(plugin))
        case "update":
          return dispatch(updatePluginRequest(plugin))
        case "lock":
          return dispatch(setVersionRange({
            identifier: plugin.identifier
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
