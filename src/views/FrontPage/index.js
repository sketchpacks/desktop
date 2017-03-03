import React, { Component } from 'react'
import { connect } from 'react-redux'

class FrontPageContainer extends Component {
  render () {
    const { plugins } = this.props

    return (
      <div className="hero hero--promo">
        <div className="container">
          <div className="row">

            <div className="column">
              <h1>Get Sketchpacks for macOS</h1>
              <h3>Discover and manage Sketch plugins right from your menu bar</h3>

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
    )
  }
}


export default FrontPageContainer
