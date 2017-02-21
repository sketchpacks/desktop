import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'

import './app.scss'

import SVGIcon from 'components/SVGIcon'
import SideBarMenu from 'components/electron/SideBarMenu'
import SearchBar from 'components/SearchBar'

import {getUpdatesCount} from 'selectors'

class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {availableUpdates} = this.props

    return (

      <div className="app">
        <header className="app__header">
          <SVGIcon
            icon={'brand'}
            shape={'path'}
            size={'3.2rem'}
            viewBox={'0 0 48 48'}
            fill={'#FFFFFF'}
          />

          <SearchBar {...this.props} />
        </header>

        <div className="app__body">
          <SideBarMenu updatesCount={availableUpdates} />

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
    availableUpdates: getUpdatesCount(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
