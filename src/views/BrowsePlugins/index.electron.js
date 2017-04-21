import React, { Component } from 'react'
import { connect } from 'react-redux'

import {getPluginsList} from 'reducers'

import withSelector from 'hoc/withSelector'
import withPluginDispatcher from 'hoc/withPluginDispatcher'
import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'

const EnhancedPluginList = ConnectedPluginList(withPluginDispatcher(withSelector(PluginList,getPluginsList)))

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.renderEmptyState = this.renderEmptyState.bind(this)
    this.renderLoadingState = this.renderLoadingState.bind(this)
  }

  renderEmptyState () {
    return (
      <div className="empty-state--expanded">
        <h4>No plugins found</h4>
      </div>
    )
  }

  renderLoadingState () {
    return (
      <div className="empty-state--expanded">
        <h4>Loading plugins</h4>
      </div>
    )
  }

  render () {
    const {plugins} = this.props

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
