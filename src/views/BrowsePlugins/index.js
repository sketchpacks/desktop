import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import qs from 'qs'
import linkHeader from 'parse-link-header'

import PluginList from 'components/PluginList'
import Pagination from 'components/Pagination'

import {
  pluginsRequest,
  pluginsReceived,
  pluginsPaginate,
  pluginsSortBy
} from 'actions'

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterSelect = this.handleFilterSelect.bind(this)
  }

  componentDidMount () {
    const { page, text } = this.props.location.query
    this.fetchPage({page: page, text: text})
  }

  fetchPage = ({page = 1, text, sort}) => {
    const { dispatch } = this.props
    const { query } = this.props.location

    const sort_by = sort || this.props.plugins.sort_by

    const apiQuery = qs.stringify({...query, page: page, text: text, sort: `${sort_by}:desc`, per_page: 10})
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
    this.fetchPage({page: page, text: text})
  }

  handleFilterSelect = (sort) => {
    const { dispatch } = this.props
    const { page, text } = this.props.location.query

    dispatch(pluginsSortBy(sort))
    this.fetchPage({page: page, text: text, sort: sort})
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <section className="hero is-primary">
          <div className="container">
            <div className="row">
              <div className="column">
                <h1 className="title">
                  Browse plugins
                </h1>
              </div>

              <div className="column column-25">
                <span onClick={() => this.handleFilterSelect('score')}>Most Popular</span> |
                <span onClick={() => this.handleFilterSelect('updated_at')}>Newest</span> |
                <span onClick={() => this.handleFilterSelect('stargazers_count')}>Stargazers on Github</span> |
                <span onClick={() => this.handleFilterSelect('version')}>Latest Version</span> |
                <span onClick={() => this.handleFilterSelect('title')}>Alphabetical</span> |
                <span onClick={() => this.handleFilterSelect('compatible_version')}>Sketch.app Compatibility Version</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="row">
            <div className="column">
              <PluginList plugins={plugins.items} />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
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

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
