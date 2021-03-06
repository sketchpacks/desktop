import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { has } from 'lodash'

import {sanitizeSemVer} from 'lib/utils'

import { isFullLocked } from 'lib/VersionLock'

import Button from 'components/Button'
import Nameplate from 'components/Nameplate'
import PluginMetric from 'components/PluginMetric'
import BeatLoader from 'respinner/lib/BeatLoader'
import Dropdown from 'components/Dropdown'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    // Sub-renders
    this.renderVersion = this.renderVersion.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderTotalDownloads = this.renderTotalDownloads.bind(this)

    // Click events
    this.handleClickLock = this.handleClickLock.bind(this)
    this.handleClickInstall = this.handleClickInstall.bind(this)
    this.handleClickRemove = this.handleClickRemove.bind(this)
    this.handleClickUpdate = this.handleClickUpdate.bind(this)
    this.handleClickPluginName = this.handleClickPluginName.bind(this)
    this.handleClickAuthorName = this.handleClickAuthorName.bind(this)

    this.state = {
      clicked: false,
      isInstalled: false,
      isLocked: false,
      isInstalling: false
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
    const {version} = this.props.plugin
    const {location} = this.props

    const tooltip = (location.pathname === '/library/managed')
      ? 'Installed version'
      : 'Latest version'

    return <PluginMetric
      icon={'versions'}
      shape={'path'}
      value={sanitizeSemVer(version)}
      tooltip={tooltip} />
  }

  renderTotalDownloads () {
    const {rollup} = this.props.plugin
    const {location} = this.props

    if (!has(this.props.plugin, 'rollup.downloads')) return

    return <PluginMetric
      icon={'downloads'}
      shape={'path'}
      value={rollup.downloads.all_time}
      tooltip={'All-time Downloads'} />
  }

  renderButton () {
    const {location,handlePluginEvent} = this.props

    if (this.state.isInstalling) return <button className='button'><BeatLoader fill="#ffffff" count={3} /></button>

    return <Button
      onClick={!this.state.isInstalled
        ? this.handleClickInstall
        : (location.pathname === '/library/updates')
          ? this.handleClickUpdate
          : this.handleClickRemove}
      actionVerb={!this.state.isInstalled
        ? 'Install'
        : (location.pathname === '/library/updates')
          ? 'Update'
          : 'Remove'}
      className={!this.state.isInstalled
        ? 'button'
        : (location.pathname === '/library/updates')
          ? 'button'
          : 'button button-installed'} />
  }

  componentWillReceiveProps (nextProps) {

    const nextPlugin = nextProps.plugin

    const newState = { ...this.state }

    try {
      newState['isInstalled'] = nextPlugin.installed_version
    } catch (err) {
      newState['isInstalled'] = false
    }

    try {
      newState['isInstalling'] = nextPlugin.isInstalling
    } catch (err) {
      newState['isInstalling'] = false
    }

    try {
      newState['isLocked'] = isFullLocked(nextPlugin.version_range)
    } catch (err) {
      newState['isLocked'] = false
    }

    this.setState({ ...newState })
  }

  componentDidMount () {
    const newState = { ...this.state }
    const {
      installed_version,
      version_range,
      isInstalling
    } = this.props.plugin

    try {
      newState['isInstalled'] = installed_version
    } catch (err) {
      newState['isInstalled'] = false
    }

    try {
      newState['isInstalling'] = isInstalling
    } catch (err) {
      newState['isInstalling'] = false
    }

    try {
      newState['isLocked'] = isFullLocked(version_range)
    } catch (err) {
      newState['isLocked'] = false
    }

    this.setState({ ...newState })
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

    return (
        <article className="o-plugin o-plugin--browse">
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
            { has(owner, 'handle') && <Nameplate
              handle={owner.handle}
              thumbnailUrl={owner.avatar_url}
              name={owner.name}
              height={24}
              width={24}
              onClick={this.handleClickAuthorName}
            /> }

            { this.renderTotalDownloads() }

            { this.renderVersion() }

            { this.renderButton() }
          </div>
        </article>
    )
  }
}

PluginMedia.propTypes = {
  plugin: React.PropTypes.object,
  handlePluginEvent: React.PropTypes.func,
}

export default PluginMedia
