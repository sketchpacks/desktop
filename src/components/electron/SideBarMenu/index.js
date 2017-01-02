import React from 'react'
import { Link } from 'react-router'

import './sidebar.scss'

const SideBarMenu = ({ handle, width, height }) => (
  <div>

    <aside className="sidebar">
      <nav>
        <div className="sidebar__section">
          <div><strong className="sidebar__subheading">Browse</strong></div>
          <div><Link to="/browse/popular" className="sidebar__item" activeClassName="sidebar__item--active">Popular</Link></div>
          <div><Link to="/browse/newest" className="sidebar__item" activeClassName="sidebar__item--active">Newest</Link></div>
        </div>

        <div className="sidebar__section">
          <div><strong className="sidebar__subheading">Library</strong></div>
          <div><Link to="/browse/popular" className="sidebar__item" activeClassName="sidebar__item--active">Installed</Link></div>
          <div><Link to="/browse/newest" className="sidebar__item" activeClassName="sidebar__item--active">Updates</Link></div>
        </div>
      </nav>
    </aside>

  </div>
)

export default SideBarMenu
