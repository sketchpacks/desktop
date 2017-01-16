import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from 'components/PluginList'

class UserPluginsContainer extends Component {
  render () {
    const { plugins, authorDetails } = this.props

    return (
      <div className="container">
        <div className="row">
          <div className="column">
            <h4>Published Plugins</h4>

            <PluginList plugins={plugins.items} authorDetails={authorDetails} />
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
  const { plugins, authorDetails } = state

  return {
    plugins,
    authorDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserPluginsContainer )
