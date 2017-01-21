import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Nameplate from 'components/Nameplate'
import ReadmeDocument from 'components/ReadmeDocument'
import InstallButton from 'components/InstallButton'
import Icon from 'components/Icon'
import PluginMetric from 'components/PluginMetric'

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
    const {
      description,
      name,
      readme,
      title,
      version,
      compatible_version,
      stargazers_count,
      watchers_count,
      score,
      source_url
    } = this.props.pluginDetails

    const title_or_name = title || name
    const owner = {
      handle: this.props.authorDetails.handle,
      avatar_url: this.props.authorDetails.avatar_url,
      name: this.props.authorDetails.name,
    }

    return (
      <div>
        <section className="hero is-primary">
          <div className="container">

            <div className="row">
              <div className="column">
                <Nameplate
                  handle={owner.handle}
                  thumbnailUrl={owner.avatar_url}
                  name={owner.name}
                  height={24}
                  width={24}
                />

                <h1 className="title">
                  {title_or_name}
                </h1>

                <p className="subtitle">
                  {description}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="column">

                <div className="o-shelf o-shelf--outlined">

                  { version && (version !== "0") && <PluginMetric
                      icon={'versions'}
                      value={version}
                      tooltip={'Latest version'}
                      /> }

                  { version && (version !== "0") && <PluginMetric
                    icon={'autoupdates'}
                    value={'Enabled'}
                    shape={'polygon'}
                    tooltip={'Automatic plugin updates'}
                  /> }

                  { compatible_version && (compatible_version !== "0") && <PluginMetric
                    icon={'compatible_version'}
                    value={compatible_version}
                    tooltip={'Compatible Sketch.app version'}
                  /> }

                  { stargazers_count && parseInt(stargazers_count) && <PluginMetric
                    icon={'stargazers'}
                    value={stargazers_count}
                    shape={'polygon'}
                    tooltip={'Stargazers on Github'}
                  /> }

                  <InstallButton plugin={this.props.pluginDetails} dispatch={this.props.dispatch} />
                </div>

              </div>
            </div>

            <div className="row">
              <div className="column">
                <Link to={source_url} className="link--small">
                  <Icon icon={'github'} /> View on Github
                </Link>
              </div>
            </div>

          </div>
        </section>

        <section className="section ">
          <div className="container">
            <div className="row">
              <div className="column">
                <ReadmeDocument markdown={readme} />
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
