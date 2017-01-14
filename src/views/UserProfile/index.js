import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  pluginsRequest,
  pluginsReceived,
  authorProfileRequest,
  authorProfileReceived
} from 'actions'

import './style.scss'

class UserProfileContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const { owner } = this.props.params
    const AUTHOR_PROFILE_URL = `https://sketchpacks-api.herokuapp.com/v1/users/${owner}`
    const opts = {
      method: 'GET',
      uri: AUTHOR_PROFILE_URL
    }

    // Get author details
    dispatch(authorProfileRequest())
    dispatch(pluginsRequest())
    fetch(AUTHOR_PROFILE_URL)
      .then((response) => {
        return response.json()
      })
      .then(json => {
        dispatch(authorProfileReceived(json))
        dispatch(pluginsReceived(json.plugins))
      })
  }

  render () {
    const { authorDetails } = this.props

    return (
      <div>
        <div className="profileHeader">
          <div className="container">
            <div className="row">
              <div className="column is-one-quarter">
                <figure className="image is-square">
                  <img src="http://placehold.it/256x256" role="presentation" />
                </figure>
                <div className="content">
                  <p className="title is-3">{authorDetails.name}</p>
                  <p className="subtitle is-5">@{authorDetails.handle}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="column">
                <ul>
                  <li><Link to={`/@${authorDetails.handle}/plugins`}>Published</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="column">
              <div className="content">
                {this.props.children}
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
  const { plugins, authorDetails } = state

  return {
    authorDetails,
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserProfileContainer )
