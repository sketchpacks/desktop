import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React from 'react'

import { Link } from 'react-router'

import Avatar from 'components/Avatar'

const Nameplate = ({ handle, thumbnailUrl, name }) => __ELECTRON__
  ? (
    <div>
      <div className="o-media" onClick={() => require('electron').remote.shell.openExternal(`${WEB_URL}/@${handle}`)}>
        <div className="o-media__left u-mar-right-x-small">
          <Avatar handle={handle} />
        </div>

        <div className="o-media__content">
          {handle || name}
        </div>
      </div>
    </div>
  )
  : (
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
