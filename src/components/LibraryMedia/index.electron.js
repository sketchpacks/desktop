import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { sanitizeSemVer } from 'lib/utils'
import { isFullLocked } from 'lib/VersionLock'

import Dropdown from 'components/Dropdown'
import Button from 'components/Button'
import Nameplate from 'components/Nameplate'
import PluginMetric from 'components/PluginMetric'
import BeatLoader from 'respinner/lib/BeatLoader'

import './library_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    // Sub-renders
    this.renderVersion = this.renderVersion.bind(this)
    this.renderVersionLock = this.renderVersionLock.bind(this)
    this.renderButton = this.renderButton.bind(this)

    // Click events
    this.handleClickRemove = this.handleClickRemove.bind(this)
    this.handleClickUpdate = this.handleClickUpdate.bind(this)
    this.handleClickPluginName = this.handleClickPluginName.bind(this)

    this.state = {
      clicked: false,
      isInstalled: false,
      isLocked: false,
      isInstalling: false
    }
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

  renderVersion () {
    let version

    const {location} = this.props

    if (location.pathname === '/library/updates') version = this.props.plugin.version

    if (location.pathname === '/library/unmanaged') version = this.props.plugin.installed_version

    return <PluginMetric
      icon={'versions'}
      shape={'path'}
      value={sanitizeSemVer(version)}
      tooltip={'Installed version'} />
  }

  renderButton () {
    const {location,handlePluginEvent} = this.props

    if (this.state.isInstalling) return <button className='button'><BeatLoader fill="#ffffff" count={3} /></button>

    return <Button
      onClick={location.pathname === '/library/updates'
        ? this.handleClickUpdate
        : this.handleClickRemove}
      actionVerb={location.pathname === '/library/updates'
        ? 'Update'
        : 'Remove'}
      className={location.pathname === '/library/updates'
        ? 'button'
        : 'button button-installed'} />
  }

  renderVersionLock () {
    return <Dropdown
      {...this.props.plugin}
      handlePluginEvent={this.props.handlePluginEvent}
    />
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
        <article className="o-plugin">
          <div className="o-media">
            <div className="o-media__content">
              <h3 className="o-plugin__name">
                <span onClick={this.handleClickPluginName}>
                  {title_or_name}
                </span>
              </h3>
            </div>
          </div>

          <div className="o-plugin__footer o-plugin__footer--recto">
            { (this.props.location.pathname === '/library/managed') &&
              this.renderVersionLock() }

            { (this.props.location.pathname !== '/library/managed') &&
              this.renderVersion() }

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
