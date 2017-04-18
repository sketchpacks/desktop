import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'
import { getUpdatedPlugins } from 'reducers/index'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class UpdatedPluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.renderEmptyState = this.renderEmptyState.bind(this)
    this.renderLoadingState = this.renderLoadingState.bind(this)
  }

  renderEmptyState () {
    return (
      <div className="empty-state--expanded">
        <span className="o-emoji o-emoji--xl">🖖🏽</span>

        <h4>No updates available</h4>

        <p>Your outdated plugins will appear here. 🔒 a plugin to prevent future
        updates from being applied.</p>
      </div>
    )
  }

  renderLoadingState () {
    return (
      <div className="empty-state--expanded">
        <h4>Loading</h4>
      </div>
    )
  }

  render () {
    const {plugins} = this.props

    return (
      <div style={{position: 'relative'}}>
        { (plugins.isLoading)
          && this.renderLoadingState() }

        { (parseInt(plugins.items.length) === 0)
          && this.renderEmptyState() }

        <EnhancedPluginList
          plugins={plugins}
          location={this.props.location}
          installedPluginIds={this.props.library.ids}
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
  return {
    state,
    plugins: {items: getUpdatedPlugins(state)},
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UpdatedPluginsContainer )
