import React, { Component } from 'react'
import { connect } from 'react-redux'

const withSelector = (WrappedComponent,pluginListSelector) => {
  class ConnectedComponent extends Component {
    constructor (props) {
      super(props)
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = (state,ownProps) => {
    return {
      state,
      plugins: pluginListSelector(state)
    }
  }

  return connect(mapStateToProps)(ConnectedComponent)
}

export default withSelector
