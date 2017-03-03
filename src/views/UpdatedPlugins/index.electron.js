import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'
import { getUpdatedPlugins } from 'selectors'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class UpdatedPluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  renderLoading () {
    return (
      <div className="container">
        <div className="row">
          <h4>Fetching more plugins...</h4>
        </div>
      </div>
    )
  }

  render () {
    const {plugins} = this.props

    return (
      <div style={{position: 'relative'}}>
        <EnhancedPluginList
          plugins={plugins}
          location={this.props.location}
          installedPluginIds={map(this.props.plugins.items, 'id')}
          dispatch={this.props.dispatch}
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
    plugins: {items:getUpdatedPlugins(state)},
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UpdatedPluginsContainer )
