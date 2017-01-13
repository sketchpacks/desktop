import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'
import {getSearchResults} from 'selectors'

class SearchResultsContainer extends Component {
  render () {
    const { plugins, keyword } = this.props

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="column">
              <h3 className="page-title">
                Showing { plugins.length } results for { keyword }
              </h3>
            </div>
          </div>
        </div>

        { (plugins.isLoading)
          ? <div>Searching all plugins...</div>
        : <PluginList plugins={plugins} /> }
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
  const { keyword } = state.search
  return {
    keyword,
    plugins: getSearchResults(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchResultsContainer )
