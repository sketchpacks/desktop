import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginList from '../../components/PluginList'

import {
  recommendsRequest,
  recommendsReceived
} from '../../actions'

class UserRecommendsContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const { owner } = this.props.params

    dispatch(recommendsRequest())

    fetch(`https://sketchpacks-api.herokuapp.com/v1/users/${owner}/collections/favorites`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch(recommendsReceived(json.plugins))
      })
  }

  render () {
    const { plugins } = this.props

    return (
      <div className="container">
        <h1>Recommended by Adam Kirkwood</h1>

        <PluginList plugins={plugins.items} />
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
  const { recommends } = state

  return {
    plugins: recommends
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserRecommendsContainer )
