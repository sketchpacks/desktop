import React from 'react'

import {
  installPluginRequest,
  uninstallPluginRequest,
  toggleVersionLockRequest,
} from 'actions/plugin_manager'

const PluginManagerHOC = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handlePluginEvent = this.handlePluginEvent.bind(this)
    }

    toggleLock ({ id, locked }) {
      const {dispatch} = this.props

      dispatch(toggleVersionLockRequest(id,locked))
    }

    componentWillReceiveProps (nextProps) {
      console.log(nextProps)
    }

    handlePluginEvent ({ type, plugin }) {
      const {dispatch} = this.props

      switch (type) {
        case "install":
          return dispatch(installPluginRequest(plugin))
        case "remove":
          return dispatch(uninstallPluginRequest(plugin))
        case "update":
          return console.log(type, plugin)
        case "lock":
          return this.toggleLock(plugin)
        case "favorite":
          return console.log(type, plugin)
        case "collect":
          return console.log(type, plugin)
      }
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
          handlePluginEvent={this.handlePluginEvent}
          dispatch={this.props.dispatch} />
      )
    }
  }

export default PluginManagerHOC
