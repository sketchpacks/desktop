import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  pluginDetailsRequest,
  pluginDetailsReceived,
  pluginReadmeRequest,
  pluginReadmeReceived
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
            <div className="columns">
              <div className="column">
                { readme }
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
  const { pluginDetails } = state
  return {
    pluginDetails,
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( PluginDetailsContainer )
