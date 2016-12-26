import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import qs from 'qs'

import PluginList from 'components/PluginList'
import linkHeader from 'parse-link-header'
import Pagination from 'components/Pagination'

import {
  pluginsRequest,
  pluginsReceived,
  pluginsPaginate
} from 'actions'

class BrowsePluginsContainer extends Component {
  componentDidMount () {
    const { page, text } = this.props.location.query
    this.fetchPage(page, text)
  }

  fetchPage = (page = 1, text) => {
    const { dispatch } = this.props
    const { query } = this.props.location

    const apiQuery = qs.stringify({...query, page: page, text: text, sort: 'updated_at:desc'})
    const browserQuery = qs.stringify({...query, text: text, page: page})

    dispatch(pluginsRequest())

    fetch(`https://sketchpacks-api.herokuapp.com/v1/plugins?${apiQuery}`)
      .then(response => {
        const pageMeta = linkHeader(response.headers.get('link'))
        if (pageMeta) { dispatch(pluginsPaginate(pageMeta)) }
        return response.json()
      })
      .then(json => {
        dispatch(pluginsReceived(json))
        browserHistory.push(`/browse?${browserQuery}`)
      })
  }

  handlePagination = (page) => {
    const { text } = this.props.location.query
    this.fetchPage(page, text)
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Browse all plugins
              </h1>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="columns">
            <div className="column">
              <Pagination plugins={plugins}
                currentPage={this.props.location.query.page}
                onSelect={(page) => this.handlePagination(page)} />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="columns">
            <PluginList plugins={plugins.items} />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
