import {remote} from 'electron'
import {settingsMenu} from 'main/menus'
const {Menu, MenuItem} = remote

import React, {Component} from 'react'
import { Link } from 'react-router'

import SVGIcon from 'components/SVGIcon'

import './sidebar.scss'

class SideBarMenu extends Component {
  constructor (props) {
    super(props)

    this.handleSettingsClick = this.handleSettingsClick.bind(this)
  }

  handleSettingsClick (event) {
    settingsMenu.popup(remote.getCurrentWindow())
  }

  render () {
    const {updatesCount} = this.props

    return (
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
            <div><Link to="/library/updates" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Updates ({updatesCount})</Link></div>
          </div>
        </nav>

        <div className="o-shelf o-shelf--centered">
          <SVGIcon
            icon={'settings'}
            shape={'path'}
            size={'24px'}
            viewBox={'0 0 24 24'}
            fill={'#818EA7'}
            onClick={this.handleSettingsClick}
            />
        </div>
      </aside>
    )
  }
}

export default SideBarMenu
