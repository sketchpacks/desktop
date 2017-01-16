import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import {
  loginSuccess,
  logoutRequest
} from 'actions'

import 'normalize.css'
import 'css/milligram.scss'
import './registry.scss'

class App extends Component {
  constructor (props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    const { jwt } = this.props.location.query

    if (jwt !== undefined) {
      dispatch(loginSuccess(jwt))
    }
  }

  handleLogout () {
    const { dispatch } = this.props

    dispatch(logoutRequest())
  }

  render () {
    const { auth } = this.props

    return (
      <div className="registry">
        <nav className="nav">
          <div className="container">

            <div className="nav-left">
              <a className="nav-item is-brand" href="/">
                <strong>Sketchpacks</strong>
              </a>
            </div>

            <span className="nav-toggle">
              <span></span>
              <span></span>
              <span></span>
            </span>

            <div className="nav-right nav-menu">
              <Link to="/browse" className="nav-item">Browse</Link>
              <Link to="/browse/popular" className="nav-item">Popular</Link>
              <Link to="/browse/newest" className="nav-item">Newest</Link>
            </div>
          </div>
        </nav>

        {this.props.children}
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
