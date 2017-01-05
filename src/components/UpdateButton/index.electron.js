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

      this.handleClick = this.handleClick.bind(this)

      this.state = {
        activity: 'update'
      }
    }

    handleClick () {
      const { dispatch, plugin } = this.props

      dispatch(installPluginRequest(this.props.plugin))
      this.setState({
        activity: 'updating'
      })
    }

    componentWillReceiveProps (nextProps) {
      const { plugin } = nextProps

      this.setState({
        activity: 'idle'
      })
    }

    renderButtonText () {
      switch(this.state.activity) {
        case 'idle':
          return 'Update'
        case 'updating':
          return 'Updating'
        default:
          return 'Update'
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
