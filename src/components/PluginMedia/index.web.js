import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import Nameplate from 'components/Nameplate'
import Button from 'components/Button'
import PluginMetric from 'components/PluginMetric'

import {sanitizeSemVer} from 'lib/utils'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    this.renderPreview = this.renderPreview.bind(this)
    this.renderVersion = this.renderVersion.bind(this)
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
        <div className="o-plugin__thumbnail">
          <img src={thumbnail_url} role="presentation" onError={() => this.setState({ hidePreview: true })} />
        </div>
      </div>
    )
  }

  renderStargazerCount () {
    const { stargazers_count } = this.props.plugin

    if (stargazers_count === "0") return

    return <PluginMetric icon={'stargazers'} shape={'polygon'} value={stargazers_count} tooltip={'Stargazers on Github'} />
  }

  renderVersion () {
    const { version } = this.props.plugin

    return <PluginMetric icon={'versions'} shape={'path'} value={sanitizeSemVer(version)} tooltip={'Latest version'} />
  }

  renderButton () {
    const {plugin} = this.props

    return (
      <a
        href={`/${plugin.owner.handle}/${plugin.name}/install`}
        className={'button'}
        target={"_blank"}
        >
        {'Install'}
      </a>
    )
  }

  renderAutoupdates () {
    const { version, auto_updates } = this.props.plugin

    if (!auto_updates) return

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
