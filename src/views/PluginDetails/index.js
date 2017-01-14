import React, { Component } from 'react'
import { connect } from 'react-redux'

import Nameplate from 'components/Nameplate'

import {
  pluginDetailsRequest,
  pluginDetailsReceived,
  pluginReadmeRequest,
  pluginReadmeReceived,
  authorProfileRequest,
  authorProfileReceived
} from 'actions'


class PluginDetailsContainer extends Component {
  constructor (props) {
    super(props)

    this.getReadme = this.getReadme.bind(this)
  }

  getReadme () {
    const { dispatch } = this.props
    const { id } = this.props.pluginDetails
    dispatch(pluginReadmeRequest())
    fetch(`https://sketchpacks-api.herokuapp.com/v1/plugins/${id}/readme`)
      .then(response => {
        return response.text()
      })
      .then(markdown => {
        dispatch(pluginReadmeReceived(markdown))
      })
  }

  componentDidMount () {
    const { dispatch } = this.props
    const { owner, id } = this.props.params

    const self = this

    dispatch(authorProfileRequest())
    fetch(`https://sketchpacks-api.herokuapp.com/v1/users/${owner}`)
      .then(response => {
        return response.json()
      })
      .then(user => {
        dispatch(authorProfileReceived(user))
      })


    dispatch(pluginDetailsRequest())
    fetch(`https://sketchpacks-api.herokuapp.com/v1/users/${owner}/plugins/${id}`)
      .then(response => {
        return response.json()
      })
      .then(plugin => {
        dispatch(pluginDetailsReceived(plugin))
        self.getReadme()
      })
  }

  render () {
    const { description, name, readme } = this.props.pluginDetails
    const owner = {
      handle: this.props.authorDetails.handle,
      avatar_url: this.props.authorDetails.avatar_url,
      name: this.props.authorDetails.name,
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {name}
              </h1>
              <h2 className="subtitle">
                {description}
              </h2>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="row">
              <div className="column">
                { readme }
              </div>

              <div className="column column-25">
                <Nameplate
                  handle={owner.handle}
                  thumbnailUrl={owner.avatar_url}
                  name={owner.name}
                  height={24}
                  width={24}
                />
              </div>
            </div>
          </div>
        </section>

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
  const { pluginDetails, authorDetails } = state
  return {
    pluginDetails,
    authorDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( PluginDetailsContainer )
