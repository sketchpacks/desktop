import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { getUpdatedPlugins } from 'selectors'

import PluginList from 'components/PluginList'

class UpdatedPluginsContainer extends Component {
  renderList () {
    const { plugins } = this.props

    if (plugins.isLoading) return (<div>Loading plugins...</div>)

    if (plugins.length === 0) return (
      <div className="empty-state--expanded">
        <h4>No updates found</h4>
        <p>All your plugins are up to date</p>
      </div>
    )

    return (<PluginList plugins={plugins.items} />)
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
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
  const { library } = state

  return {
    state,
    plugins: getUpdatedPlugins(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UpdatedPluginsContainer )
