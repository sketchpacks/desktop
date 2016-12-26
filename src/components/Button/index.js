import React from 'react'

const Button = ({ actionVerb, onClick }) => (
  <div>
    <button className="button" onClick={onClick}>{actionVerb}</button>
  </div>
)

export default Button
