import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'

import { getInstalledPlugins } from 'selectors'

class InstalledPluginsContainer extends Component {
  renderList () {
    const { plugins } = this.props

    if (plugins.isLoading) return (<div>Loading plugins...</div>)

    if (plugins.items.length === 0) return (
      <div className="empty-state--expanded">
        <h4>No installed plugins found</h4>
        <p>Your installed plugins will be shown here</p>
      </div>
    )

    return (<PluginList plugins={plugins} />)
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
    plugins: library
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( InstalledPluginsContainer )
