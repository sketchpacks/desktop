import React from 'react'
import Icon from 'components/Icon'

const PluginMetric = ({ icon, shape, value, tooltip }) => (
  <div className="o-media tooltipped tooltipped-n" aria-label={tooltip}>
    <div className="o-media__left">
      <Icon icon={icon} shape={shape} />
    </div>
    <div className="o-media__content">
      <span className="o-metric__value">{value}</span>
    </div>
  </div>
)

export default PluginMetric
