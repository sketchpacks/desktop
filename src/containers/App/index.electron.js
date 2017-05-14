import { ipcRenderer, ipcMain } from 'electron'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'

import './app.scss'

import {getOutdatedPlugins} from 'reducers/index'
import SVGIcon from 'components/SVGIcon'
import SideBarMenu from 'components/electron/SideBarMenu'
import SearchBar from 'components/SearchBar'

class App extends Component {
  constructor (props) {
    super(props)

    this.renderOverlay = this.renderOverlay.bind(this)

    this.handleImportClick = this.handleImportClick.bind(this)
    this.handleExportClick = this.handleExportClick.bind(this)

    this.renderLibraryActions = this.renderLibraryActions.bind(this)
  }

  handleImportClick () {
    ipcRenderer.send('sketchpack/IMPORT_REQUEST')
  }

  handleExportClick () {
    ipcRenderer.send('sketchpack/EXPORT_REQUEST')
  }

  renderLibraryActions () {
    return (
      <div className="header__actions">
        <span
          className="tooltipped tooltipped-s"
          aria-label={'Import sketchpack'}
        >
          <SVGIcon
            icon={'import'}
            shape={'path'}
            size={'2.4rem'}
            viewBox={'0 0 24 24'}
            fill={'#7F9BE5'}
            onClick={this.handleImportClick}
          />
        </span>

        <span
          className="tooltipped tooltipped-s"
          aria-label={'Export My Library'}

        >
          <SVGIcon
            icon={'export'}
            shape={'path'}
            size={'2.4rem'}
            viewBox={'0 0 24 24'}
            fill={'#7F9BE5'}
            onClick={this.handleExportClick}
          />
        </span>
      </div>
    )
  }

  renderOverlay () {
    return (
      <div className="overlay">
        <h2>Importing 🚚</h2>
        <p>This might take a few minutes</p>
      </div>
    )
  }

  render () {
    const {availableUpdates,isImporting} = this.props

    return (
      <div className="app">
        { isImporting && this.renderOverlay() }

        <SideBarMenu updatesCount={availableUpdates} />

        <div className="app__body">
          <header className='app__header'>
            { this.props.location.pathname === '/library/managed'
              && this.renderLibraryActions()  }

             { this.props.location.pathname !== '/library/managed'
               && this.props.location.pathname !== '/library/unmanaged'
              && this.props.location.pathname !== '/library/updates'
                && <SearchBar {...this.props} classNames={'searchBar'} /> }
          </header>

          <div className="app__viewport">
            { this.props.children }
          </div>
        </div>
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

function mapStateToProps(state, ownProps) {
  return {
    state,
    availableUpdates: getOutdatedPlugins(state).length,
    isImporting: state.sketchpack.isImporting
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
