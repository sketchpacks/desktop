import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'

import './app.scss'

import SideBarMenu from 'components/electron/SideBarMenu'

class App extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const { dispatch } = this.props
  }

  render () {

    return (

      <div className="app">
        <SideBarMenu />

        <div className="viewport">
          { this.props.children }
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
  const { plugins } = state

  return {
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
