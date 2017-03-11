import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import 'normalize.css'
import 'css/milligram.scss'
import './registry.scss'

import SVGIcon from 'components/SVGIcon'
import SearchBar from 'components/SearchBar'
import {LikeButton,TweetButton} from 'components/ShareButtons'

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
          <div className="container container--xl">
            <div className="row">
              <div className="column">

                <nav>
                  <a href="/" className="branding">
                    <SVGIcon
                      icon={'brand'}
                      shape={'path'}
                      size={'1.6em'}
                      fill={'#000000'}
                      viewBox={'0 0 48 48'}
                    />
                  </a>

                  <SearchBar
                    location={this.props.location}
                    classNames={'searchBar'} />

                  <div className="nav-group">
                    <a href="/browse" className="nav__item">Browse</a>

                    <a
                      href="https://github.com/integration/sketchpacks-relay"
                      className="nav__item"
                      target="_blank"
                    >
                      Submit Plugins
                    </a>
                  </div>
                </nav>

              </div>
            </div>
          </div>
        </div>

        {this.props.children}

        <footer className="footer--registry">
          <div className="footer-section">
            <p>
              <SVGIcon
                icon={'brand'}
                shape={'path'}
                size={'1.1em'}
                fill={'#ffffff'}
                viewBox={'0 0 48 48'}
              />
              &nbsp;
              Made with love by
              &nbsp;
              <a href="https://github.com/adamkirkwood" target="_blank">@adamkirkwood</a>
              &nbsp;&amp;&nbsp;
              <a href="https://github.com/willdavis" target="_blank">@willdavis</a>
            </p>

            <p>
              <small>&copy; 2017 Sketchpacks. All plugins are owned by their respective authors.</small>
            </p>
          </div>

          <div className="footer-section">
            <a href="https://github.com/integration/sketchpacks-relay" target="_blank">Submit your plugins</a>
            &nbsp;&bull;&nbsp;
            <a href="https://medium.com/building-sketchpacks" target="_blank">Blog</a>
            &nbsp;&bull;&nbsp;
            <a href="https://medium.com/building-sketchpacks/release-notes/home" target="_blank">Release Notes</a>
            &nbsp;&bull;&nbsp;
            <a href="https://github.com/sketchpacks/bug-reports" target="_blank">Report a bug</a>
            &nbsp;&bull;&nbsp;
            <a href="https://github.com/sketchpacks/feedback" target="_blank">Give us feedback</a>
          </div>

          <div className="footer-section">
            <div className="o-shelf o-shelf__social-buttons o-shelf--recto">
              <TweetButton
                url="https://sketchpacks.com"
                text="Sketchpacks for macOS — Manage your Sketch plugins from the menu bar"
                via="sketchpacks"
                related="adamkirkwood"
                showCount />

              <LikeButton
                href="https://sketchpacks.com"
                layout={"button_count"}
                action={"like"}
                size={"small"}
                showFaces={"false"}
                share />
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
  const { location } = ownProps

  return {
    plugins: catalog,
    location: location
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( App )
