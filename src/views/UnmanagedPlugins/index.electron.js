import React, { Component } from 'react'
import { connect } from 'react-redux'

import {getUnmanagedPlugins} from 'reducers/index'
import withPluginDispatcher from 'hoc/withPluginDispatcher'
import withSelector from 'hoc/withSelector'
import LibraryList from 'components/LibraryList'
const ConnectedLibraryList = withPluginDispatcher(withSelector(LibraryList,getUnmanagedPlugins))

class UnmanagedPluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {location,dispatch} = this.props

    return (
      <div style={{position: 'relative'}}>
        <ConnectedLibraryList
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
