import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

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
        <div className="container">
          <div className="row">
            <div className="column column__content">
              <EnhancedPluginList
                plugins={plugins}
                location={this.props.location}
                dispatch={this.props.dispatch}
              />
            </div>
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
  const { catalog,search } = state

  return {
    plugins: catalog,
    search,
    location: ownProps.location
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
