import React from 'react'

const Avatar = ({ handle, width, height }) => (
  <div>
    <img className="image is-maker"
      src={`https://github.com/${handle}.png`}
      role="presentation"
      width={width}
      height={height}
    />
  </div>
)

Avatar.defaultProps = { width: 24, height: 24 }

export default Avatar
