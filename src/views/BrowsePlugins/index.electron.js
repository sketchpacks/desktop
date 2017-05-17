import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getPluginIdentifiers } from 'reducers'

import withSelector from 'hoc/withSelector'
import withPluginDispatcher from 'hoc/withPluginDispatcher'
import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'

const EnhancedPluginList = ConnectedPluginList(withPluginDispatcher(withSelector(PluginList,getPluginIdentifiers)))

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <EnhancedPluginList
          state={this.props.state}
          location={this.props.location}
          dispatch={this.props.dispatch}
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
  const { search,location } = state

  return {
    state,
    search,
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
