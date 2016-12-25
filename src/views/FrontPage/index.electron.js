import { remote } from 'electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from '../../components/PluginList'

import {
  pluginsRequest,
  pluginsReceived
} from '../../actions'

let catalog = remote.getGlobal('catalog')

class FrontPageContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(pluginsRequest())
    
    catalog.getAllPlugins()
      .then(plugins => dispatch(pluginsReceived(plugins)))
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container">
          <div className="columns">

            <div className="column">
              <div className="content">
                <h3>Popular Plugins</h3>

                <PluginList plugins={plugins.items} />
              </div>
            </div>

            <div className="column">
              <div className="content">
                <h3>Newest Plugins</h3>

                <PluginList plugins={plugins.items} />
              </div>
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
  const { plugins } = state

  return {
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( FrontPageContainer )
