import React from 'react'

const BrowseError = ({ message, onRetry }) => (
  <div>
    <p>Could not fetch plugins. {message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
)

export default BrowseError
