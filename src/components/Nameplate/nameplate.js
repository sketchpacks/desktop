import React from 'react'

import Avatar from 'components/Avatar'

import './nameplate.scss'

 /* FIXME: CSS for pointer style */

const Nameplate = ({ handle, thumbnailUrl, name, onClick }) => (
  <div className="o-nameplate">
    <div className="o-media" onClick={onClick}>
      <div className="o-media__left u-mar-right-x-small">
        <Avatar handle={handle} />
      </div>

      <div className="o-media__content">
        {handle || name}
      </div>
    </div>
  </div>
)

export default Nameplate
