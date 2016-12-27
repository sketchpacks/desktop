import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Link } from 'react-router'

import Nameplate from 'components/Nameplate'
import InstallButton from 'components/InstallButton'

import moment from 'moment'

import './plugin_media.scss'

class PluginMedia extends Component {
  constructor (props) {
    super(props)

    this.renderPreview = this.renderPreview.bind(this)
    this.renderVersion = this.renderVersion.bind(this)
    this.renderScore = this.renderScore.bind(this)
    this.renderUpdateTimestamp = this.renderUpdateTimestamp.bind(this)
  }

  renderPreview () {
    const { thumbnail_url } = this.props.plugin

    if (thumbnail_url === null)
      return

    if (thumbnail_url === undefined)
      return

    return (
      <div className="o-media__right u-mar-left-large">
        <img src={thumbnail_url} role="presentation" />
      </div>
    )
  }

  renderScore () {
    const { score } = this.props.plugin

    if (score === 0)
      return

    return (
      <span>{score}/5.0</span>
    )
  }

  renderUpdateTimestamp () {
    return // todo: How might this be more informative?

    const { updated_at } = this.props.plugin
    const relativeDateTime = moment(updated_at).fromNow()

    if (updated_at === undefined)
      return

    return (
      <span>Released {relativeDateTime}</span>
    )
  }

  renderVersion () {
    const { version } = this.props.plugin

    if (version === "0")
      return

    return (
      <span>v{version}</span>
    )
  }

  render () {
    const { name, description, owner, version, score, handleCTAClick } = this.props.plugin

    return (
        <article className="o-plugin">
          <div className="o-media">
            <div className="o-media__content">
              <h5>
                { __ELECTRON__ ? (
                  <a href={`${WEB_URL}/${owner.handle}/${name}`}>
                    {name}
                  </a>
                ) : (
                  <Link to={`/${owner.handle}/${name}`}>
                    {name}
                  </Link>
                ) }
              </h5>
              <p>
                {description}
              </p>
            </div>

            { this.renderPreview() }
          </div>

          <div className="o-plugin__footer">
            <Nameplate
              handle={owner.handle}
              thumbnailUrl={owner.avatar_url}
              name={owner.name}
              height={24}
              width={24}
            />

            { this.renderVersion() }

            { this.renderUpdateTimestamp() }

            { this.renderScore() }

            <InstallButton plugin={this.props.plugin} dispatch={this.props.dispatch}/>
          </div>
        </article>
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

export default connect(mapStateToProps, mapDispatchToProps)( PluginMedia )
