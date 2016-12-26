import React from 'react'
import Button from 'components/Button'
import InstallButton from 'components/InstallButton'
import {
  installPluginRequest,
  uninstallPluginRequest
} from 'actions/plugin_manager'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)

      this.state = {
        activity: props.plugin.installed ? 'installed' : 'idle'
      }
    }

    handleClick () {
      const { dispatch, plugin } = this.props

      if (!plugin.installed) {
        dispatch(installPluginRequest(this.props.plugin))
        this.setState({ activity: 'installing' })
      }

      if (plugin.installed) {
        dispatch(uninstallPluginRequest(this.props.plugin))
        this.setState({ activity: 'removing' })
      }
    }

    componentWillReceiveProps (nextProps) {
      const { plugin } = nextProps
      this.setState({
        activity: plugin.installed ? 'installed' : 'idle'
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
          actionVerb={this.renderButtonText()}
          onClick={this.handleClick} />
      )
    }
  }

export default Connect(Button)
