import React from 'react'

import {
  toggleVersionLockRequest
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

    handlePluginEvent ({ type, plugin }) {
      switch (type) {
        case "install":
          return console.log(type, plugin)
        case "remove":
          return console.log(type, plugin)
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
          plugin={this.props.plugin}
          state={this.props.state}
          dispatch={this.props.dispatch}
          handlePluginEvent={this.handlePluginEvent} />
      )
    }
  }

export default PluginManagerHOC
