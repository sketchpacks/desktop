import React from 'react'

import { getVersionLock } from 'lib/VersionLock'
import { sanitizeSemVer } from 'lib/utils'

import semver from 'semver'

const LockGaugeFull = () => {
  return (
    <div className="lock-meter">
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
    </div>
  )
}

const LockGaugePatch = () => {
  return (
    <div className="lock-meter">
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar"></span>
    </div>
  )
}

const LockGaugeMinor = () => {
  return (
    <div className="lock-meter">
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar"></span>
      <span className="lock-meter__bar"></span>
    </div>
  )
}

const LockGaugeUnlocked = () => {
  return (
    <div className="lock-meter">
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar"></span>
      <span className="lock-meter__bar"></span>
      <span className="lock-meter__bar"></span>
    </div>
  )
}

const GAUGES = {
  locked: LockGaugeFull,
  minor: LockGaugeMinor,
  patch: LockGaugePatch,
  unlocked: LockGaugeUnlocked
}

const LockGauge = ({ version_range }) => {
  const lock_strength = getVersionLock(version_range)
  const Gauge = GAUGES[lock_strength] || 'locked'

  return <Gauge />
}

export default LockGauge
