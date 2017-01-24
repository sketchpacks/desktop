import React from 'react'
import SVGIcon from 'components/SVGIcon'

const PluginMetric = ({ icon, shape, value, tooltip }) => (
  <div className="o-media tooltipped tooltipped-n" aria-label={tooltip}>
    <div className="o-media__left">
      <SVGIcon icon={icon} shape={shape} />
    </div>
    <div className="o-media__content">
      <span className="o-metric__value">{value}</span>
    </div>
  </div>
)

export default PluginMetric
