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

import SVGIcon from 'components/SVGIcon'
import SearchBar from 'components/SearchBar'

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
        <div className="mainNav">
          <div className="container">
            <div className="row">
              <div className="column">

                <nav>
                  <a className="branding" href="/">
                    <SVGIcon icon={'stargazers'} shape={'polygon'} size={'1em'} />
                    <strong>Sketchpacks</strong>
                  </a>

                  <div className="searchBar">
                      <SearchBar location={this.props.location}/>
                  </div>

                  <div className="nav-group">
                    <Link to="/browse" className="nav__item">Browse</Link>
                  </div>
                </nav>

              </div>
            </div>
          </div>
        </div>

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
