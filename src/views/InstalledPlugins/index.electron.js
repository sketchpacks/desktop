import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'

import {getInstalledPlugins} from 'selectors'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class InstalledPluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.renderEmptyState = this.renderEmptyState.bind(this)
    this.renderLoadingState = this.renderLoadingState.bind(this)
  }

  renderEmptyState () {
    return (
      <div className="empty-state--expanded">
        <span className="o-emoji o-emoji--xl">😐</span>
        <h4>No installed plugins</h4>

        <p>Plugins you install via Sketchpacks will appear here.</p>
      </div>
    )
  }

  renderLoadingState () {
    return (
      <div className="empty-state--expanded">
        <h4>Loading library</h4>
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
          sketchpack={this.props.state.sketchpack}
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
  const { library } = state

  const plugins = {
    items: getInstalledPlugins(state)
  }

  return {
    library,
    state,
    plugins,
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( InstalledPluginsContainer )
