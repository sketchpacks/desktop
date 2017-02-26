import React from 'react'

import './styles.scss'

const Badge = ({ value }) => (
  <span className={'badge'}>{value}</span>
)

Badge.defaultProps = { value: '' }

export default Badge
