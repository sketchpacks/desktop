import React from 'react'
import Button from 'components/Button'

import {
  installPluginRequest,
  uninstallPluginRequest
} from 'actions/plugin_manager'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      console.log(props)

      // this.handleClick = this.handleClick.bind(this)

      this.state = {
        activity: props.isInstalled
          ? 'installed'
          : 'idle'
      }
    }

    // handleClick () {
    //   const { dispatch, plugin, isInstalled } = this.props
    //
    //   if (!isInstalled) {
    //     dispatch(installPluginRequest(plugin))
    //     this.setState({ activity: 'installing' })
    //   }
    //
    //   if (isInstalled) {
    //     dispatch(uninstallPluginRequest(plugin))
    //     this.setState({ activity: 'removing' })
    //   }
    // }

    componentWillReceiveProps (nextProps) {
      const { plugin, isInstalled } = nextProps
      this.setState({
        activity: isInstalled
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
      const {plugin,isInstalled} = this.props
      const buttonLabel = isInstalled ? 'remove' : 'install'

      return (
        <ComposedComponent
          {...this.props}
          className={this.state.activity === 'installed' ? 'button button-installed' : 'button'}
          actionVerb={this.renderButtonText()}
        />
      )
    }
  }

export default Connect(Button)
