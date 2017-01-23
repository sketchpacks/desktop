import React, { Component } from 'react'
import { connect } from 'react-redux'

import axios from 'axios'

import PluginList from 'components/PluginList'

import {
  pluginsRequest,
  pluginsReceived
} from 'actions'

class FrontPageContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(pluginsRequest())

    const api = axios.create({
      baseURL: 'https://sketchpacks-api.herokuapp.com/v1/',
      timeout: 1500,
      responseType: 'json',
    })

    api.get(`/plugins?page=1&per_page=5`)
      .then(response => {
        dispatch(pluginsReceived(response.data))
      })
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <section className="hero is-primary is-large">
          <div className="container">
            <div className="row">
              <h1 className="title">
                Get Sketchpacks for macOS
              </h1>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="row">
            <div className="column">
              <h4>Popular Plugins</h4>

              <PluginList plugins={plugins.items} />
            </div>
          </div>

          <div className="row">
            <div className="column">
              <h4>Newest Plugins</h4>

              <PluginList plugins={plugins.items} />
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
