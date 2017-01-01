import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'

import './app.scss'

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
        <div className="sidebar">
          <div className="sidebar__section">
            <div><strong className="sidebar__subheading">Browse</strong></div>
            <div><Link to="/browse/popular" className="sidebar__item">Popular</Link></div>
            <div><Link to="/browse/newest" className="sidebar__item">Newest</Link></div>
          </div>

          <div className="sidebar__section">
            <div><strong className="sidebar__subheading">Library</strong></div>
            <div><Link to="/browse/popular" className="sidebar__item">Installed</Link></div>
            <div><Link to="/browse/newest" className="sidebar__item">Updates</Link></div>
          </div>
        </div>

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
