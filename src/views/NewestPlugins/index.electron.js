import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { getPluginList } from 'selectors/catalog'
import PluginList from 'components/PluginList'

class NewestPluginsContainer extends Component {
  render () {
    const { plugins } = this.props

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Newest plugins
              </h1>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="columns">
            { (plugins === undefined)
                ? <div>No plugins</div>
                : <PluginList plugins={plugins} /> }

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
    state,
    plugins: getPluginList(state, ownProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( NewestPluginsContainer )
