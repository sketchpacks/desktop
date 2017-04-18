import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'

import {getPluginsList} from 'reducers'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

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

        { (plugins.isLoading)
          && this.renderLoadingState() }

        { (parseInt(plugins.length) === 0)
          && this.renderEmptyState() }

        <EnhancedPluginList
          state={this.props.state}
          plugins={plugins}
          location={this.props.location}
          dispatch={this.props.dispatch}
          sketchpack={this.props.sketchpack}
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
  const { search,library,location,sketchpack } = state

  const plugins = { items: getPluginsList(state) }

  return {
    state,
    plugins,
    search,
    library,
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
