import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'

import {getInstalledPlugins} from 'selectors'

import {setVersionRange} from 'reducers/sketchpack'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class InstalledPluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.renderEmptyState = this.renderEmptyState.bind(this)

    this.handlePluginEvent = this.handlePluginEvent.bind(this)
  }

  handlePluginEvent ({ type, plugin, author, isLocked }) {
    const {dispatch} = this.props

    switch (type) {
      case "remove":
        return dispatch(uninstallPluginRequest(plugin))
      case "lock":
        return dispatch(setVersionRange({
          namespace: `${plugin.owner.handle}/${plugin.name}`,
          identifier: plugin.identifier,
          version: plugin.version,
          compatible_version: plugin.compatible_version
        }))
      case "info":
        return remote.shell.openExternal(`${WEB_URL}/${plugin.owner.handle}/${plugin.name}`)
      case "author":
        return remote.shell.openExternal(`${WEB_URL}/@${plugin.owner.handle}`)
    }
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
