import React, { Component } from 'react'
import { connect } from 'react-redux'

import {getUnmanagedPlugins} from 'reducers/index'
import withSelector from 'hoc/withSelector'
import PluginList from 'components/PluginList'
const ConnectedPluginList = withSelector(PluginList,getUnmanagedPlugins)

class UnmanagedPluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {location,dispatch} = this.props

    return (
      <div style={{position: 'relative'}}>
        <ConnectedPluginList
          handlePluginEvent={this.handlePluginEvent}
          location={location}
          dispatch={dispatch}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

function mapStateToProps(state, ownProps) {
  return {
    state,
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UnmanagedPluginsContainer )
