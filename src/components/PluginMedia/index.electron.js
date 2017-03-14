import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {sanitizeSemVer} from 'lib/utils'

import Button from 'components/Button'
import Nameplate from 'components/Nameplate'
import PluginMetric from 'components/PluginMetric'
import BeatLoader from 'respinner/lib/BeatLoader'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    // Sub-renders
    this.renderVersion = this.renderVersion.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderVersionLock = this.renderVersionLock.bind(this)

    // Click events
    this.handleClickLock = this.handleClickLock.bind(this)
    this.handleClickInstall = this.handleClickInstall.bind(this)
    this.handleClickRemove = this.handleClickRemove.bind(this)
    this.handleClickUpdate = this.handleClickUpdate.bind(this)
    this.handleClickPluginName = this.handleClickPluginName.bind(this)
    this.handleClickAuthorName = this.handleClickAuthorName.bind(this)

    this.state = {
      hidePreview: props.thumbnail_url === "",
      isInstalled: props.isInstalled,
      clicked: false,
    }
  }

  handleClickLock () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'lock', plugin: plugin })
  }

  handleClickInstall () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'install', plugin: plugin })
    this.setState({
      clicked: true
    })
  }

  handleClickRemove () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'remove', plugin: plugin })
    this.setState({
      clicked: true
    })
  }

  handleClickUpdate () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'update', plugin: plugin })
  }

  handleClickPluginName () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'info', plugin: plugin })
  }

  handleClickAuthorName () {
    const {plugin} = this.props
    this.props.handlePluginEvent({ type: 'author', plugin: plugin })
  }

  renderVersion () {
    const { version, installed_version } = this.props.plugin
    const {location} = this.props

    const value = (location.pathname === '/library/installed')
      ? installed_version
      : version

    const tooltip = (location.pathname === '/library/installed')
      ? 'Installed version'
      : 'Latest version'

    return <PluginMetric
      icon={'versions'}
      shape={'path'}
      value={sanitizeSemVer(value)}
      tooltip={tooltip} />
  }

  renderButton () {
    const {location,handlePluginEvent} = this.props
    const {isInstalled} = this.props

    if (this.state.clicked) return <button className='button'><BeatLoader fill="#ffffff" count={3} /></button>

    return <Button
      onClick={!isInstalled
        ? this.handleClickInstall
        : (location.pathname === '/library/updates')
          ? this.handleClickUpdate
          : this.handleClickRemove}
      actionVerb={!isInstalled
        ? 'Install'
        : (location.pathname === '/library/updates')
          ? 'Update'
          : 'Remove'}
      className={!isInstalled
        ? 'button'
        : (location.pathname === '/library/updates')
          ? 'button'
          : 'button button-installed'} />
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isInstalled !== nextProps.isInstalled) {
      this.setState({
        clicked: false
      })
    }
  }

  renderVersionLock () {
    const {plugin,location} = this.props

    if (location.pathname !== '/library/installed') return

    return (
      <div
        onClick={this.handleClickLock}
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
    const {
      name,
      description,
      owner,
      version,
      score,
      handleCTAClick,
      title
    } = this.props.plugin
    const title_or_name = title || name
    const isInstalled = this.state.isInstalled || false

    return (
        <article className="o-plugin">
          <div className="o-media">
            <div className="o-media__content">
              <h3 className="o-plugin__name">
                <span onClick={this.handleClickPluginName}>
                  {title_or_name}
                </span>
              </h3>
              <p className="o-plugin__logline">
                {description}
              </p>
            </div>
          </div>

          <div className="o-plugin__footer">
            <Nameplate
              handle={owner.handle}
              thumbnailUrl={owner.avatar_url}
              name={owner.name}
              height={24}
              width={24}
              onClick={this.handleClickAuthorName}
            />

            { this.renderVersion() }

            { this.renderAutoupdates() }

            { this.renderVersionLock() }

            { this.renderButton() }
          </div>
        </article>
    )
  }
}

PluginMedia.propTypes = {
  isInstalled: React.PropTypes.bool,
  plugin: React.PropTypes.object,
  handlePluginEvent: React.PropTypes.func,
}

export default PluginMedia
