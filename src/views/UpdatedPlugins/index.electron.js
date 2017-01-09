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

  renderList () {
    const { plugins } = this.props

    if (plugins.isLoading) return (<div>Loading plugins...</div>)

    if (plugins.items.length === 0) return (<div>No plugins found</div>)

    return (<PluginList plugins={plugins.items} />)
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="column">
              <h3 className="title">
                Pending updates
              </h3>
            </div>
          </div>
        </div>

        { this.renderList() }
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
