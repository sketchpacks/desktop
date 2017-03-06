import React from 'react'

const Button = ({ actionVerb, onClick, className }) => (
  <button className={className} onClick={onClick}>{actionVerb}</button>
)

export default Button
