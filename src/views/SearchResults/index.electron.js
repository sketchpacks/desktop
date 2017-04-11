import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {map,includes} from 'lodash'

import PluginList from 'components/PluginList'
import ConnectedPluginList from 'hoc/ConnectedPluginList'
const EnhancedPluginList = ConnectedPluginList(PluginList)

class SearchResultsContainer extends Component {
  constructor (props) {
    super(props)
  }

  renderLoading () {
    return (
      <div className="container">
        <div className="row">
          <h4>Fetching installed plugins...</h4>
        </div>
      </div>
    )
  }

  render () {
    const {keyword,plugins} = this.props

    return (
      <div style={{position: 'relative'}}>

        <div className="container">
          <div className="row">
            <div className="column">
              <h3 className="page-title">
                Showing { plugins.items.length } results for { keyword }
              </h3>
            </div>
          </div>
        </div>

        <EnhancedPluginList
          plugins={plugins}
          location={this.props.location}
          installedPluginIds={this.props.library.ids}
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
  const {search,library} = state

  return {
    keyword: search.keyword || "",
    plugins: search,
    library,
    location: state.routing.locationBeforeTransitions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchResultsContainer )
