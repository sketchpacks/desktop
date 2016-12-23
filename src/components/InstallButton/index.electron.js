import React from 'react'
import Button from '../Button'
import InstallButton from '../InstallButton'
import { installPluginRequest } from '../../actions/plugin_manager'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)

      this.state = {
        activity: 'idle'
      }
    }

    handleClick () {
      const { dispatch } = this.props
      dispatch(installPluginRequest(this.props.plugin))
      this.setState({
        activity: 'downloading'
      })
    }

    renderButtonText () {
      switch(this.state.activity) {
        case 'idle':
          return 'Install'
        case 'downloading':
          return 'Downloading...'
        case 'installed':
          return 'Remove'
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
