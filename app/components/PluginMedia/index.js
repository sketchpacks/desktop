import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Link } from 'react-router'


class PluginMedia extends Component {
  constructor (props) {
    super(props)

    this.renderPreview = this.renderPreview.bind(this)
  }

  renderPreview () {
    const { thumbnail_url } = this.props.plugin
    if (thumbnail_url === '') return 

    return (
      <figure className="media-right">
        <p className="image is-64x64">
          <img src={thumbnail_url} role="presentation" />
        </p>
      </figure>
    )
  }

  render () {
    const { name, description, owner } = this.props.plugin

    return (
      <div className="box">
        <article className="media">
          <div className="media-content">
            <div className="content">
              <p>
                <strong className="title"><Link to={`/${owner.handle}/${name}`}>{name}</Link></strong><br />
                <Link to={`/@${owner.handle}`} className="subtitle">{owner.handle}</Link>
              </p>

              <p>
                {description}
              </p>
            </div>
          </div>

          { this.renderPreview() }
        </article>
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
  const { recommends } = state
  const { id } = ownProps.plugin

  const isRecommended = () => {
    return _.includes(_.map(recommends.items, 'id'), id )
  }

  return {
    state,
    recommends,
    isRecommended: isRecommended()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( PluginMedia )
