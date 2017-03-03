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
          installedPluginIds={map(this.props.library.items, 'id')}
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
  const { catalog,search,library,location } = state

  return {
    library,
    plugins: catalog,
    search,
    location: state.routing.locationBeforeTransitions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
