import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {getUpdatedPlugins} from 'reducers/index'

import {setVersionRange} from 'reducers/sketchpack'

import PluginList from 'components/PluginList'

class UpdatedPluginsContainer extends Component {
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
        <span className="o-emoji o-emoji--xl">🖖🏽</span>

        <h4>No updates available</h4>

        <p>Your outdated plugins will appear here. 🔒 a plugin to prevent future
        updates from being applied.</p>
      </div>
    )
  }

  render () {
    const {plugins,location,dispatch} = this.props

    return (
      <div style={{position: 'relative'}}>
        { (parseInt(plugins.length) === 0)
          && this.renderEmptyState() }

        <PluginList
          handlePluginEvent={this.handlePluginEvent}
          plugins={plugins}
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
    plugins: { items: getUpdatedPlugins(state) },
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UpdatedPluginsContainer )
