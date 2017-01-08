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
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Showing { plugins.items.length } results for { q }
              </h1>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="columns">
            <PluginList plugins={plugins.items} />
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
  const { plugins } = state

  return {
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchResultsContainer )
