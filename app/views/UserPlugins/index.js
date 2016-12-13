import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from '../../components/PluginList'

import {
  pluginsRequest,
  pluginsReceived
} from '../../actions'

class UserRecommendsContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(pluginsRequest())

    fetch(`https://sketchpacks-api.herokuapp.com/v1/plugins`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch(pluginsReceived(json))
      })
  }

  render () {
    const { plugins, recommends } = this.props

    return (
      <div className="container">
        <h1>Plugins by Adam Kirkwood</h1>

        <PluginList plugins={plugins.items} recommends={recommends} />
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
  const { plugins, recommends } = state

  return {
    plugins,
    recommends
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserRecommendsContainer )
