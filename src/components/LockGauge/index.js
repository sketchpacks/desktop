import React from 'react'

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

const LockGaugeMinor = () => {
  return (
    <div className="lock-meter">
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar lock-meter__bar--filled"></span>
      <span className="lock-meter__bar"></span>
    </div>
  )
}

const LockGaugePatch = () => {
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
  full: LockGaugeFull,
  minor: LockGaugeMinor,
  patch: LockGaugePatch,
  unlocked: LockGaugeUnlocked
}

const LockGauge = ({ gauge }) => {
  const Gauge = GAUGES[gauge] || 'full'
  return <Gauge />
}

export default LockGauge
