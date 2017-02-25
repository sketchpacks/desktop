import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import PluginManagerHOC from 'hoc/Manager'

import { Link } from 'react-router'

import Nameplate from 'components/Nameplate'
import InstallButton from 'components/InstallButton'
import UpdateButton from 'components/UpdateButton'
import PluginMetric from 'components/PluginMetric'

import {sanitizeSemVer} from 'lib/utils'

import {
  toggleVersionLockRequest
} from 'actions/plugin_manager'

import moment from 'moment'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    this.renderPreview = this.renderPreview.bind(this)
    this.renderVersion = this.renderVersion.bind(this)
    this.renderScore = this.renderScore.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderVersionLock = this.renderVersionLock.bind(this)

    this.state = {
      hidePreview: false,
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

  renderScore () {
    return
    const {location} = this.props.state.app

    if (location === '/library/updates') return

    const { score } = this.props.plugin

    if (score === 0)
      return

    return (
      <span>{parseFloat(score).toFixed(1)}/5.0</span>
    )
  }

  renderVersion () {
    const { version, installed_version } = this.props.plugin
    const {location} = this.props.state.app

    const value = (location === '/library/updates')
      ? installed_version
      : version

    const tooltip = (location === '/library/updates')
      ? 'Installed version'
      : 'Latest version'

    return <PluginMetric
      icon={'versions'}
      shape={'path'}
      value={sanitizeSemVer(value)}
      tooltip={tooltip} />
  }

  renderButton () {
    const {location} = this.props.state.app

    return (location === '/library/updates')
      ? <UpdateButton {...this.props} />
      : <InstallButton {...this.props} />
  }

  renderVersionLock () {
    const {plugin,handlePluginEvent} = this.props
    const {location} = this.props.state.app
    if (location !== '/library/installed') return

    return (
      <div
        onClick={() => handlePluginEvent({ type: 'lock', plugin })}
        className="tooltipped tooltipped-n"
        aria-label={plugin.locked
          ? 'Enable auto-updates'
          : `Lock this version at v${sanitizeSemVer(plugin.installed_version)}` }
      >
        {plugin.locked ? '🔒' : '🔓'}
      </div>
    )
  }

  renderAutoupdates () {
    const { version, auto_updates } = this.props.plugin

    if (!auto_updates) return

    return <PluginMetric
      icon={'autoupdates'}
      value={'Auto-updates'}
      shape={'polygon'}
      tooltip={'Automatic plugin updates'}
    />
  }

  render () {
    const { name, description, owner, version, score, handleCTAClick, title } = this.props.plugin
    const title_or_name = title || name
    const isInstalled = this.props.plugin || false

    return (
        <article className="o-plugin">
          <div className="o-media">
            <div className="o-media__content">
              <h3 className="o-plugin__name">
                { __ELECTRON__ ? (
                  <span onClick={() => require('electron').remote.shell.openExternal(`${WEB_URL}/${owner.handle}/${name}`)}>
                    {title_or_name}
                  </span>
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

            { this.renderScore() }

            { this.renderVersionLock() }

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

export default connect(mapStateToProps, mapDispatchToProps)( PluginManagerHOC(PluginMedia) )
