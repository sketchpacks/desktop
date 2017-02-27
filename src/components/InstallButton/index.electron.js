import React from 'react'
import Button from 'components/Button'

import {map,includes} from 'lodash'

import {
  installPluginRequest,
  uninstallPluginRequest
} from 'actions/plugin_manager'

const isInstalled = (state, pluginId) => {
  return includes(map(state.library.items, 'id'), pluginId)
}

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)

      this.state = {
        activity: isInstalled(props.state, props.plugin.id)
          ? 'installed'
          : 'idle'
      }
    }

    handleClick () {
      const { dispatch, plugin } = this.props

      const installed = isInstalled(this.props.state, plugin.id)

      if (!installed) {
        dispatch(installPluginRequest(plugin))
        this.setState({ activity: 'installing' })
      }

      if (installed) {
        dispatch(uninstallPluginRequest(plugin))
        this.setState({ activity: 'removing' })
      }
    }

    componentWillReceiveProps (nextProps) {
      const { plugin } = nextProps
      this.setState({
        activity: isInstalled(nextProps.state, plugin.id)
          ? 'installed'
          : 'idle'
      })
    }

    renderButtonText () {
      switch(this.state.activity) {
        case 'idle':
          return 'Install'
        case 'installing':
          return 'Installing'
        case 'installed':
          return 'Remove'
        case 'removing':
          return 'Uninstalling'
        default:
          return 'Install'
      }
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
          className={this.state.activity === 'installed' ? 'button button-installed' : 'button'}
          actionVerb={this.renderButtonText()}
          onClick={this.handleClick}

        />
      )
    }
  }

export default Connect(Button)
