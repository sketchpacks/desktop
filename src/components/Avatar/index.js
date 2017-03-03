import React from 'react'
import LazyLoad from 'react-lazyload'

const Avatar = ({ handle, width, height }) => (
  <div>
    <LazyLoad height={height} offset={200} unmountIfInvisible debounce={500}>
      <img className="image is-maker"
        src={`https://github.com/${handle}.png`}
        role="presentation"
        width={width}
        height={height}
      />
    </LazyLoad>
  </div>
)

Avatar.defaultProps = { width: 24, height: 24 }

export default Avatar
