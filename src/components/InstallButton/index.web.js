import React from 'react'
import Button from 'components/Button'
import InstallButton from 'components/InstallButton'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)
    }

    handleClick () {
      window.location = `sketchpacks://install/${this.props.plugin.id}`
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
          actionVerb={'Install'}
          onClick={this.handleClick} />
      )
    }
  }

export default Connect(Button)
