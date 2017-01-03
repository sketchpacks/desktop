import React from 'react'
import { Link } from 'react-router'

import './sidebar.scss'

const SideBarMenu = () => (
  <aside className="app__sidebar">
    <nav>
      <div className="app__sidebar-section">
        <div><strong className="app__sidebar-subheading">Browse</strong></div>
        <div><Link to="/browse/popular" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Popular</Link></div>
        <div><Link to="/browse/newest" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Newest</Link></div>
      </div>

      <div className="app__sidebar-section">
        <div><strong className="app__sidebar-subheading">Library</strong></div>
        <div><Link to="/library/installed" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Installed</Link></div>
        <div><Link to="/library/updates" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Updates</Link></div>
      </div>
    </nav>
  </aside>
)

export default SideBarMenu
