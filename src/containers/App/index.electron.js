import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'

import './app.scss'

import SideBarMenu from 'components/electron/SideBarMenu'
import SearchBar from 'components/electron/SearchBar'

class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {

    return (

      <div className="app">
        <header className="app__header">
          <SearchBar {...this.props} />
        </header>

        <div className="app__body">
          <SideBarMenu />

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
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
