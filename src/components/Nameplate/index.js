import React from 'react'
import { Link } from 'react-router'

import Avatar from '../Avatar'

const Nameplate = ({ handle, thumbnailUrl, name }) => (
  <div>
    <Link to={`/@${handle}`}>
      <div className="o-media">
        <div className="o-media__left u-mar-right-x-small">
          <Avatar handle={handle} />
        </div>

        <div className="o-media__content">
          {handle || name}
        </div>
      </div>
    </Link>
  </div>
)

export default Nameplate
