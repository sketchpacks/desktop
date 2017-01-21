import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Link } from 'react-router'

import Nameplate from 'components/Nameplate'
import InstallButton from 'components/InstallButton'
import PluginMetric from 'components/PluginMetric'

import moment from 'moment'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    this.renderPreview = this.renderPreview.bind(this)
    this.renderVersion = this.renderVersion.bind(this)
    this.renderScore = this.renderScore.bind(this)
    this.renderUpdateTimestamp = this.renderUpdateTimestamp.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderStargazerCount = this.renderStargazerCount.bind(this)

    this.state = {
      hidePreview: false
    }
  }

  renderPreview () {
    if (this.state.hidePreview) return

    const { thumbnail_url } = this.props.plugin

    if (thumbnail_url === null) {
      this.setState({ hidePreview: true })
      return
    }

    if (thumbnail_url === undefined) {
      this.setState({ hidePreview: true })
      return
    }

    return (
      <div className="o-media__right u-mar-left-large">
        <img src={thumbnail_url} role="presentation" onError={() => this.setState({ hidePreview: true })} />
      </div>
    )
  }

  renderScore () {
    return
    const {location} = this.props.state.app

    const { score } = this.props.plugin

    if (score === 0)
      return

    return (
      <span>{parseFloat(score).toFixed(1)}/5.0</span>
    )
  }

  renderUpdateTimestamp () {
    return // todo: How might this be more informative?

    const { updated_at } = this.props.plugin
    const relativeDateTime = moment(updated_at).fromNow()

    if (updated_at === undefined)
      return

    return (
      <span>Released {relativeDateTime}</span>
    )
  }

  renderStargazerCount () {
    const { stargazers_count } = this.props.plugin

    if (stargazers_count === "0") return

    return <PluginMetric icon={'stargazers'} shape={'polygon'} value={stargazers_count} tooltip={'Stargazers on Github'} />
  }

  renderVersion () {
    const { version } = this.props.plugin

    if (version === "0") return

    return <PluginMetric icon={'versions'} shape={'path'} value={version} tooltip={'Latest version'} />
  }

  renderButton () {
    const {location} = this.props.state.app
    const {plugin,dispatch} = this.props

    return <InstallButton plugin={plugin} dispatch={dispatch} />
  }

  renderAutoupdates () {
    const { version } = this.props.plugin

    if (version === "0") return

    return <PluginMetric
      icon={'autoupdates'}
      value={'Enabled'}
      shape={'polygon'}
      tooltip={'Automatic plugin updates'}
    />
  }

  render () {
    const { name, description, owner, version, score, handleCTAClick, title } = this.props.plugin
    const title_or_name = title || name


    return (
        <article className="o-plugin">
          <div className="o-media">
            <div className="o-media__content">
              <h3 className="o-plugin__name">
                { __ELECTRON__ ? (
                  <a href={`${WEB_URL}/${owner.handle}/${name}`}>
                    {title_or_name}
                  </a>
                ) : (
                  <Link to={`/${owner.handle}/${name}`}>
                    {title_or_name}
                  </Link>
                ) }
              </h3>

              <p className="o-plugin__logline">
                {description}
              </p>
            </div>

            { this.renderPreview() }
          </div>

          <div className="o-plugin__footer">
            <Nameplate
              handle={owner.handle}
              thumbnailUrl={owner.avatar_url}
              name={owner.name}
              height={24}
              width={24}
            />

            { this.renderVersion() }

            { this.renderAutoupdates() }

            { this.renderUpdateTimestamp() }

            { this.renderScore() }

            { this.renderStargazerCount() }

            { this.renderButton() }
          </div>
        </article>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

function mapStateToProps(state, ownProps) {
  return {
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( PluginMedia )
