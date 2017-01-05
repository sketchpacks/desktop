import {remote} from 'electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {
  pluginsRequest,
  pluginsReceived,
} from 'actions'

import PluginList from 'components/PluginList'

const Catalog = remote.getGlobal('Catalog')

class InstalledPluginsContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(pluginsRequest())
    Catalog.getInstalledPlugins()
      .then(plugins => dispatch(pluginsReceived(plugins)))
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container">
          <div className="columns">
            <h3 className="title">
              Your plugins
            </h3>

            { (plugins === undefined)
              ? <div>No plugins</div>
              : <PluginList plugins={plugins.items} /> }
          </div>
        </div>
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
  const { plugins } = state

  return {
    state,
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( InstalledPluginsContainer )
