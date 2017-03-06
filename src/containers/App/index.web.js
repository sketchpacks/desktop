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
  }

  componentDidMount () {
    const { dispatch } = this.props
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
                      fill={'#000000'}
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
