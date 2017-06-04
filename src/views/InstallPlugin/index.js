import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  fetchUser,
  fetchPluginDetails
} from 'actions'

import 'normalize.css'
import 'css/milligram.scss'
import './styles.scss'

class InstallPluginContainer extends Component {
  constructor (props) {
    super(props)

    this.initiateDownload = this.initiateDownload.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    const { owner, id } = this.props.params

    dispatch(fetchPluginDetails({ pluginId: id, userId: owner }))
  }

  componentDidUpdate () {
    if (!this.props.pluginDetails.isLoading) {
      setTimeout(this.initiateDownload, 5000)
    }
  }

  initiateDownload () {
    const { identifier } = this.props.pluginDetails
    window.location = `sketchpacks://install/${identifier}`
  }

  render () {
    const {title, name, download_url, isLoading} = this.props.pluginDetails

    return (
      <div className="billboard">

        <section>
          <img src={require('static/images/icon.png')} width="132" />

          <div
            className={!isLoading
              ? 'billboard-content billboard-content--show'
              : 'billboard-content'}
          >
            <h1>Installing {title || name || '...'}</h1>

            <p>If the installation does not start after 5 seconds, make sure <a href="https://sketchpacks-releases.herokuapp.com/download/latest/osx">Sketchpacks for macOS</a> is installed. Or, <a href={download_url}>download the plugin</a> manually.</p>
          </div>
        </section>


        <footer>&copy; 2017 Sketchpacks</footer>
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
    pluginDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( InstallPluginContainer )
