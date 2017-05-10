import React, { Component } from 'react'

import semver from 'semver'
import { setVersionRange,getPatchLevelLock,getMinorLevelLock } from 'reducers/sketchpack'
import { sanitizeSemVer } from 'lib/utils'

import LockGauge from 'components/LockGauge'

import 'normalize.css'
import 'css/milligram.scss'

class Dropdown extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: false,
      lock_gauge: 'unlocked'
    }

    this.toggleVisibility = this.toggleVisibility.bind(this)

    this.handleFullLock = this.handleFullLock.bind(this)
    this.handlePatchLock = this.handlePatchLock.bind(this)
    this.handleMinorLock = this.handleMinorLock.bind(this)
    this.handleUnlocked = this.handleUnlocked.bind(this)
  }

  toggleVisibility () {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleFullLock () {
    const {installed_version, identifier} = this.props
    this.props.handlePluginEvent({
      type: 'lock',
      version: installed_version,
      identifier: identifier,
      lock_strength: 'full'
    })
    this.toggleVisibility()
    this.setState({ lock_gauge: 'full' })
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
    this.setState({ lock_gauge: 'minor' })
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
    this.setState({ lock_gauge: 'patch' })
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
    this.setState({ lock_gauge: 'unlocked' })
  }

  render () {
    return (

      <div className="lock-select">
        <div className="lock-viewer button--dropdown" onClick={this.toggleVisibility}>
          <LockGauge gauge={this.state.lock_gauge} />

          <span className="lock__label">v{this.props.version}</span>
        </div>

        <ul className={this.state.visible
            ? 'dropdown__menu is-visible'
            : 'dropdown__menu'}>
          <li onClick={this.handleUnlocked}>
            <div className="lock-select__option">
              <strong>Unlocked</strong>
              <p>Apply all updates automatically</p>
            </div>
          </li>

          <li onClick={this.handleMinorLock}>
            <div className="lock-select__option">
              <strong>Minor Updates</strong>
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(getMinorLevelLock(this.props.version))[0][1])}</p>
            </div>
          </li>

          <li onClick={this.handlePatchLock}>
            <div className="lock-select__option">
              <strong>Patch Updates</strong>
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(getPatchLevelLock(this.props.version))[0][1])}</p>
            </div>
          </li>

          <li onClick={this.handleFullLock}>
            <div className="lock-select__option">
              <strong>Full Lock</strong>
              <p>Lock at v{this.props.version}</p>
            </div>
          </li>
        </ul>
      </div>

    )
  }
}


export default Dropdown
