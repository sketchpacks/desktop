import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {
  pluginsRequest,
  pluginsReceived,
} from 'actions'

import PluginList from 'components/PluginList'

class UpdatedPluginsContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(pluginsRequest())
    Catalog.getUpdatedPlugins()
      .then(plugins => dispatch(pluginsReceived(plugins)))
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container">
          <div className="columns">
            <h3 className="title">
              Pending updates
            </h3>

            { (plugins === undefined)
              ? <div>All your plugins are up-to-date</div>
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

export default connect(mapStateToProps, mapDispatchToProps)( UpdatedPluginsContainer )
