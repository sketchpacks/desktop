import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from 'components/PluginList'

class UserPluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="column column__content">
            <h4>Published Plugins</h4>

            <PluginList plugins={this.props.plugins} />
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
  const { authorPlugins } = state

  return {
    plugins: authorPlugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserPluginsContainer )
