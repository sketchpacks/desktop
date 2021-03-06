import {remote} from 'electron'
import {settingsMenu} from 'main/menus'
const {Menu, MenuItem} = remote
import log from 'electron-log'

import React, {Component} from 'react'
import { Link } from 'react-router'

import SVGIcon from 'components/SVGIcon'
import Badge from 'components/Badge'

import './sidebar.scss'

import AutoLaunch from 'auto-launch'

const autolauncher = new AutoLaunch({
	name: 'Sketchpacks'
})

class SideBarMenu extends Component {
  constructor (props) {
    super(props)

    this.handleSettingsClick = this.handleSettingsClick.bind(this)
  }

  handleSettingsClick (event) {
    settingsMenu.popup(remote.getCurrentWindow())
  }

  render () {
    autolauncher.isEnabled().then(isEnabled => {
      settingsMenu.items[4].checked = isEnabled
    })

    const {updatesCount} = this.props

    return (
      <aside className="app__sidebar">
        <nav>
          <div className="app__sidebar-section">
            <div><strong className="app__sidebar-subheading">My Library</strong></div>
            <div><Link to="/library/managed" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Managed</Link></div>
            <div><Link to="/library/unmanaged" className="app__sidebar-item" activeClassName="app__sidebar-item--active">Unmanaged</Link></div>
            <div>
              <Link
                to="/library/updates"
                className="app__sidebar-item"
                activeClassName="app__sidebar-item--active">
                Updates
                {parseInt(updatesCount) > 0
                  && <Badge value={updatesCount} />}
              </Link>
            </div>
          </div>

          <div className="app__sidebar-section">
            <div><strong className="app__sidebar-subheading">Browse</strong></div>
						<div><Link to={{ pathname: '/browse/newest', query: { sort: 'created_at:desc', page: 1, append: false } }} className="app__sidebar-item" activeClassName="app__sidebar-item--active">Newest</Link></div>
            <div><Link to={{ pathname: '/browse/popular', query: { sort: 'score:desc', page: 1, append: false } }} className="app__sidebar-item" activeClassName="app__sidebar-item--active">Popular</Link></div>
            <div><Link to={{ pathname: '/browse/name', query: { sort: 'name:asc', page: 1, append: false } }} className="app__sidebar-item" activeClassName="app__sidebar-item--active">A-Z</Link></div>
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
