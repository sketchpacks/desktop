import React, { Component } from 'react'

import semver from 'semver'
import { setVersionRange } from 'reducers/sketchpack'
import { sanitizeSemVer } from 'lib/utils'

import { minorLockedSemver,patchLockedSemver,getVersionLock } from 'lib/VersionLock'

import LockGauge from 'components/LockGauge'

import 'normalize.css'
import 'css/milligram.scss'

class Dropdown extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: false,
      lock_strength: 'unlocked'
    }

    this.toggleVisibility = this.toggleVisibility.bind(this)

    this.handleFullLock = this.handleFullLock.bind(this)
    this.handlePatchLock = this.handlePatchLock.bind(this)
    this.handleMinorLock = this.handleMinorLock.bind(this)
    this.handleUnlocked = this.handleUnlocked.bind(this)

    this.renderTooltipText = this.renderTooltipText.bind(this)
  }

  toggleVisibility () {
    this.setState({
      visible: !this.state.visible
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      lock_strength: getVersionLock(nextProps.version_range)
    })
  }

  handleFullLock () {
    const {installed_version, identifier} = this.props
    this.props.handlePluginEvent({
      type: 'lock',
      version: installed_version,
      identifier: identifier,
      lock_strength: 'locked'
    })
    this.toggleVisibility()
    this.setState({ lock_strength: 'locked' })
  }

  handleMinorLock () {
    const {installed_version, identifier} = this.props
    this.props.handlePluginEvent({
      type: 'lock',
      version: installed_version,
      identifier: identifier,
      lock_strength: 'minor'
    })
    this.toggleVisibility()
    this.setState({ lock_strength: 'minor' })
  }

  handlePatchLock () {
    const {installed_version, identifier} = this.props
    this.props.handlePluginEvent({
      type: 'lock',
      version: installed_version,
      identifier: identifier,
      lock_strength: 'patch'
    })
    this.toggleVisibility()
    this.setState({ lock_strength: 'patch' })
  }

  handleUnlocked () {
    const {installed_version, identifier} = this.props
    this.props.handlePluginEvent({
      type: 'lock',
      version: installed_version,
      identifier: identifier,
      lock_strength: 'unlocked'
    })
    this.toggleVisibility()
    this.setState({ lock_strength: 'unlocked' })
  }

  renderTooltipText () {
    switch (this.state.lock_strength) {
      case 'locked':
        return `Locked at v${this.props.version}`
      case 'unlocked':
        return "Apply all updates automatically"
      case 'minor':
        return "Allow minor-level updates"
      case 'patch':
        return "Allow patch-level updates"
      case 'custom':
        return "Custom version lock"
    }
  }

  render () {
    return (

      <div className="lock-select tooltipped tooltipped-n" aria-label={this.renderTooltipText()}>
        <div
          className="lock-viewer button--dropdown"
          onClick={this.toggleVisibility}
        >
          <LockGauge version_range={this.props.version_range} />

          <span className="lock__label">v{this.props.version}</span>
        </div>

        <ul className={this.state.visible
            ? 'dropdown__menu is-visible'
            : 'dropdown__menu'}>

          <li onClick={this.handleFullLock}>
            <div className="lock-select__option">
              <strong>Full Lock</strong>
              <p>Lock at v{this.props.version}</p>
            </div>
          </li>

          <li onClick={this.handlePatchLock}>
            <div className="lock-select__option">
              <strong>Patch Updates</strong>
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(patchLockedSemver(this.props.version))[0][1])}</p>
            </div>
          </li>

          <li onClick={this.handleMinorLock}>
            <div className="lock-select__option">
              <strong>Minor Updates</strong>
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(minorLockedSemver(this.props.version))[0][1])}</p>
            </div>
          </li>

          <li onClick={this.handleUnlocked}>
            <div className="lock-select__option">
              <strong>Unlocked</strong>
              <p>Apply all updates automatically</p>
            </div>
          </li>

        </ul>
      </div>

    )
  }
}


export default Dropdown
