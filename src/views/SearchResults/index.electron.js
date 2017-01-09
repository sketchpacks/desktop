import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PluginList from 'components/PluginList'

class SearchResultsContainer extends Component {
  render () {
    const { plugins } = this.props
    const { q } = this.props.location.query

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="column">
              <h3 className="title">
                Showing { plugins.items.length } results for { q }
              </h3>
            </div>
          </div>
        </div>

        { (plugins.isLoading)
          ? <div>Searching all plugins...</div>
          : <PluginList plugins={plugins.items} /> }
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
  const { plugins } = state

  return {
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchResultsContainer )
