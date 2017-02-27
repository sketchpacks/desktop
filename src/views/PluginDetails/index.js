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
  fetchUser,
  fetchPluginDetails
} from 'actions'

class PluginDetailsContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const { owner, id } = this.props.params

    dispatch(fetchUser(owner))
    dispatch(fetchPluginDetails({ pluginId: id, userId: owner }))
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
                  <Link to={source_url} className="link--small u-mar-right-medium" target="_blank">
                    View on Github
                  </Link>

                  <Link to={`${source_url}/issues/new`} className="link--small" target="_blank">
                    Report a Bug
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
