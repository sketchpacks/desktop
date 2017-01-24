import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {SketchpacksApi} from 'api'

import Nameplate from 'components/Nameplate'
import ReadmeDocument from 'components/ReadmeDocument'
import InstallButton from 'components/InstallButton'
import SVGIcon from 'components/SVGIcon'
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

    this.fetchAuthorDetails = this.fetchAuthorDetails.bind(this)
    this.fetchPluginDetails = this.fetchPluginDetails.bind(this)
    this.fetchReadme = this.fetchReadme.bind(this)
  }

  fetchReadme () {
    const { dispatch } = this.props
    const { id } = this.props.pluginDetails

    dispatch(pluginReadmeRequest())
    SketchpacksApi.getPluginReadme({pluginId: id})
      .then(response => {
        dispatch(pluginReadmeReceived(response.data))
      })
  }

  fetchPluginDetails () {
    const { dispatch } = this.props
    const { owner, id } = this.props.params
    const self = this

    dispatch(pluginDetailsRequest())
    SketchpacksApi.getPlugin({userId: owner, pluginId: id})
      .then(response => {
        dispatch(pluginDetailsReceived(response.data))
        self.fetchReadme()
      })
  }

  fetchAuthorDetails () {
    const { dispatch } = this.props
    const { owner, id } = this.props.params
    const self = this

    dispatch(authorProfileRequest())
    SketchpacksApi.getUser({userId: owner})
      .then(response => {
        dispatch(authorProfileReceived(response.data))
        self.fetchPluginDetails()
      })
  }

  componentDidMount () {
    this.fetchAuthorDetails()
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

                <div className="o-shelf o-shelf--verso">
                  <Link to={source_url} className="link--small">
                    <SVGIcon icon={'github'} /> View on Github
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </section>

        <section className="section ">
          <div className="container">
            <div className="row">
              <div className="column">
                <ReadmeDocument markdown={readme || '# No README found'} />
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
