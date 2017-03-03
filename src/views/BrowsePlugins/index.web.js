import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {plugins} = this.props

    return (
      <div style={{position: 'relative'}}>
        <EnhancedPluginList
          plugins={plugins}
          location={this.props.location}
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
  const { catalog,search,location } = state

  return {
    plugins: catalog,
    search,
    location: state.routing.locationBeforeTransitions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
