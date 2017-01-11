import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'

import { getInstalledPlugins } from 'selectors'

class InstalledPluginsContainer extends Component {
  renderList () {
    const { plugins } = this.props

    if (plugins.isLoading) return (<div>Loading plugins...</div>)

    if (plugins.length === 0) return (<div>No plugins found</div>)

    return (<PluginList plugins={plugins} />)
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="column">
              <h3 className="title">
                Your plugins
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
    plugins: getInstalledPlugins(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( InstalledPluginsContainer )
