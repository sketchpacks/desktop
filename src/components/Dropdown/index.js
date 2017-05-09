import React, { Component } from 'react'

import semver from 'semver'
import { setVersionRange } from 'reducers/sketchpack'
import { sanitizeSemVer } from 'lib/utils'

import 'normalize.css'
import 'css/milligram.scss'

class Dropdown extends Component {
  constructor (props) {
    super(props)

    console.log(this.props)

    this.state = {
      visible: false
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
  }

  render () {
    return (

      <div className="lock-select">
        <div className="lock-viewer button--dropdown" onClick={this.toggleVisibility}>
          <div className="lock-meter">
            <span className="lock-meter__bar"></span>
            <span className="lock-meter__bar"></span>
            <span className="lock-meter__bar"></span>
            <span className="lock-meter__bar"></span>
          </div>

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
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(`^${this.props.version}`)[0][1])}</p>
            </div>
          </li>

          <li onClick={this.handlePatchLock}>
            <div className="lock-select__option">
              <strong>Patch Updates</strong>
              <p>Apply all updates less than v{sanitizeSemVer(semver.toComparators(`~${this.props.version}`)[0][1])}</p>
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
