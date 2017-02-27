import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'
import './registry.scss'

import SVGIcon from 'components/SVGIcon'
import SearchBar from 'components/SearchBar'

class App extends Component {
  constructor (props) {
    super(props)

    this.renderPromo = this.renderPromo.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
  }

  renderPromo () {
    return (
      <div className="hero hero--promo">
        <div className="container">
          <div className="row">

            <div className="column">
              <h1>Get Sketchpacks for macOS</h1>
              <h3>Discover and manage Sketch plugins right from your menu bar</h3>

              <Link
                to="https://sketchpacks-releases.herokuapp.com/download/channel/beta"
                className="button"
              >
                Download Sketchpacks
              </Link>

              <small>
                 macOS 10.10 or above required &bull; Sketch 40 or above required
              </small>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <img src={require('static/images/promo-screenshot.png')} />
            </div>
          </div>

        </div>
      </div>
    )
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
                  <Link to="/" className="branding">
                    <SVGIcon
                      icon={'brand'}
                      shape={'path'}
                      size={'1.1em'}
                      viewBox={'0 0 48 48'}
                    />
                    <strong>Sketchpacks</strong>
                  </Link>

                  <SearchBar location={this.props.location} classNames={'searchBar'} />

                  <div className="nav-group">
                    <Link to="/browse" className="nav__item">Browse</Link>
                  </div>
                </nav>

              </div>
            </div>
          </div>
        </div>

        { this.props.location.pathname === '/'
          && this.renderPromo() }

        {this.props.children}

        <footer className="registry-footer">
          <div className="container">
            <div className="row">
              <div className="column registry-footer__branding">
                <SVGIcon
                  icon={'brand'}
                  shape={'path'}
                  size={'5em'}
                  viewBox={'0 0 48 48'}
                  fill={'#FFFFFF'}
                />

                <p>
                  Discover and manage your Sketch plugins from the menu bar.
                </p>

                <em>&copy; 2017 Sketchpacks. All plugins are owned by their respective authors.</em>
              </div>
            </div>
          </div>
        </footer>
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
  const { catalog } = state

  return {
    plugins: catalog
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
