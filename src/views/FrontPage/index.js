import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SVGIcon from 'components/SVGIcon'
import {LikeButton,TweetButton} from 'components/ShareButtons'

import 'normalize.css'
import 'css/milligram.scss'
import './styles.scss'

class FrontPageContainer extends Component {
  render () {
    const { plugins } = this.props

    return (
      <div>

        <div className="mainNav mainNav--promo">
          <div className="container container--xl">
            <div className="row">
              <div className="column">

                <nav>
                  <Link to="/" className="branding">
                    <SVGIcon
                      icon={'brand'}
                      shape={'path'}
                      size={'1.6em'}
                      fill={'#ffffff'}
                      viewBox={'0 0 48 48'}
                    />
                  </Link>

                  <div className="nav-group">
                    <Link to="/browse" className="nav__item">Browse</Link>

                    <div className="o-shelf o-shelf__social-buttons">
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
                </nav>

              </div>
            </div>
          </div>
        </div>


        <div className="hero hero--promo">

          <div className="container">
            <div className="row">
              <div className="column">
                <h1>Sketchpacks for macOS</h1>
                <h3>Browse, manage, and auto-update your Sketch plugins from the menu bar</h3>

                <a
                  href="https://sketchpacks-releases.herokuapp.com/download"
                  className="button"
                >
                  Download Sketchpacks
                </a>

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

        <div className="container container--xl l-benefits">
          <div className="row">
            <div className="column" style={{textAlign: 'center'}}>
              <h2>Powerful plugin management without the complexity</h2>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <h3>⚡️ Auto&ndash;updates</h3>
              <p>Keep your plugins up to date with the latest release served by the Sketchpacks Registry.</p>
            </div>

            <div className="column">
              <h3>🔒 Version Locking</h3>
              <p>Don’t let unexpected compatibility issues break your workflow. Lock plugins at specific versions.</p>
            </div>

            <div className="column">
              <h3>We ❤️ Sketch Developers</h3>
              <p>Focus on developing plugins. Serve plugin updates from your github with <a href="https://github.com/integration/sketchpacks-relay" target="_blank">Sketchpacks Relay</a>.</p>
            </div>
          </div>
        </div>


        <footer className="footer--registry">
          <div className="footer-section">
            <p>
              Made with love by
              &nbsp;
              <a href="https://twitter.com/adamkirkwood">@adamkirkwood</a>
              &nbsp;&amp;&nbsp;
              <a href="https://twitter.com/willdavis84">@willdavis84</a>
              &nbsp;&mdash;
              <span className="emoji">🖖🏽</span>
            </p>

            <p>
              <small>&copy; 2017 Sketchpacks. All plugins are owned by their respective authors.</small>
            </p>
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


export default FrontPageContainer
