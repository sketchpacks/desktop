import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'

class SearchResultsContainer extends Component {
  render () {
    const { plugins, keyword } = this.props

    return (
      <div className="container">
        <div className="row">
          <div className="column column__content">
            <h5 className="page-title">
              Showing { plugins.items.length } results for { keyword }
            </h5>

            <PluginList
              plugins={plugins}
            />
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
  const {search} = state

  return {
    keyword: search.keyword,
    plugins: search,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchResultsContainer )
