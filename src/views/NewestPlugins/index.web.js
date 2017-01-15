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

class NewestPluginsContainer extends Component {
  componentDidMount () {
    const { page } = this.props.location.query
    this.fetchPage(page)
  }

  fetchPage = (page = 1) => {
    const { dispatch } = this.props

    const queryScope = qs.stringify({
      page: page,
      sort: 'created_at:desc'
    })

    dispatch(pluginsRequest())

    fetch(`https://sketchpacks-api.herokuapp.com/v1/plugins?${queryScope}`)
      .then(response => {
        const pageMeta = linkHeader(response.headers.get('link'))
        dispatch(pluginsPaginate(pageMeta))
        return response.json()
      })
      .then(json => {
        dispatch(pluginsReceived(json))
        browserHistory.push(`/browse/newest?page=${page}`)
      })
  }

  handlePagination = (page) => {
    this.fetchPage(page)
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Newest plugins
              </h1>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="columns">
            <PluginList plugins={plugins.items} />
          </div>
        </div>

        <div className="container">
          <div className="columns">
            <div className="column">
              <Pagination plugins={plugins}
                currentPage={this.props.location.query.page}
                onSelect={(page) => this.handlePagination(page)} />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)( NewestPluginsContainer )
