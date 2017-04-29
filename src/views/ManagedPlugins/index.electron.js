import React, { Component } from 'react'
import { connect } from 'react-redux'

import {getManagedPlugins} from 'reducers/index'
import withPluginDispatcher from 'hoc/withPluginDispatcher'
import withSelector from 'hoc/withSelector'
import PluginList from 'components/PluginList'
const ConnectedPluginList = withPluginDispatcher(withSelector(PluginList,getManagedPlugins))

class ManagedPluginsContainer extends Component {
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

export default connect(mapStateToProps, mapDispatchToProps)( ManagedPluginsContainer )