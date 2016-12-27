import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from 'components/PluginList'

class UserPluginsContainer extends Component {
  render () {
    const { plugins, authorDetails } = this.props

    return (
      <div className="container">
        <h1>Published Plugins</h1>

        <PluginList plugins={plugins.items} authorDetails={authorDetails} />
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
  const { plugins, authorDetails } = state

  return {
    plugins,
    authorDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserPluginsContainer )
