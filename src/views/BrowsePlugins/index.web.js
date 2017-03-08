import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.renderEmptyState = this.renderEmptyState.bind(this)
    this.renderLoadingState = this.renderLoadingState.bind(this)
  }

  renderEmptyState () {
    return (
      <div className="empty-state--expanded">
        <h4>No plugins found</h4>
      </div>
    )
  }

  renderLoadingState () {
    return (
      <div className="empty-state--expanded">
        <h4>Loading</h4>
      </div>
    )
  }

  render () {
    const {plugins} = this.props

    return (
      <div style={{position: 'relative'}}>
        <div className="container">
          <div className="row">
            <div className="column column__content">

              { (plugins.isLoading)
                && this.renderLoadingState() }

              { (parseInt(plugins.total) === 0)
                && this.renderEmptyState() }
                
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
  const { catalog } = state

  return {
    plugins: catalog,
    location: ownProps.location
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
