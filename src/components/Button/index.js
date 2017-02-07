import React from 'react'

const Button = ({ actionVerb, onClick, className }) => (
  <div>
    <button className={className} onClick={onClick}>{actionVerb}</button>
  </div>
)

export default Button
