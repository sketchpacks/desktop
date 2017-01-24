import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import qs from 'qs'
import linkHeader from 'parse-link-header'
import {SketchpacksApi} from 'api'

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
    this.handleSort = this.handleSort.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.renderFilterLabel = this.renderFilterLabel.bind(this)

    this.state = {
      open: false
    }
  }

  componentDidMount () {
    const { page, q, sort } = this.props.location.query
    this.fetchPage({page: page, q: q, sort: sort})
  }

  fetchPage = ({page = 1, q, sort}) => {
    const { dispatch } = this.props
    const { query } = this.props.location

    const sort_by = sort || this.props.plugins.sort_by

    const apiQuery = qs.stringify({...query, page: page, text: q, sort: `${sort_by}`, per_page: 10})
    const browserQuery = qs.stringify({...query, page: page, q: q, sort: `${sort_by}` })

    dispatch(pluginsRequest())

    SketchpacksApi.getCatalog({query: apiQuery})
      .then(response => {
        const pageMeta = linkHeader(response.headers.link)
        if (pageMeta) { dispatch(pluginsPaginate(pageMeta)) }

        dispatch(pluginsReceived(response.data))
        browserHistory.push(`/browse?${browserQuery}`)
      })
  }

  handlePagination = (page) => {
    const { q, sort } = this.props.location.query
    this.fetchPage({page: page, q: q, sort: sort})
  }

  handleSort = (sort) => {
    const { dispatch } = this.props
    const { page, q } = this.props.location.query

    if (this.props.plugins.sort_by !== sort) {
      dispatch(pluginsSortBy(sort))
      this.fetchPage({page: page, q: q, sort: sort})
    }
    this.handleToggle()
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }

  renderFilterLabel = (sort) => {
    switch (sort) {
      case 'score':
        return "Popularity"
      case 'compatible_version':
        return "Sketch Version"
      case 'created_at':
        return "Newest"
      case 'score':
        return "Most popular"
      case 'updated_at':
        return "Recently updated"
      case 'title':
        return "By Name"
    }
  }

  render () {
    const { plugins } = this.props

    return (
      <div>
        <div className="container container--padded-top">
          <div className="row">
            <div className="column">

              <div className="o-shelf o-shelf--baseline">
                <h4 className="title">
                  Browse plugins
                </h4>

                <div className="button-group">
                  <button type="button" className="button-clear button--dropdown" onClick={this.handleToggle}>
                    <span>Sort:</span>
                    <span>{this.renderFilterLabel(plugins.sort_by.split(':')[0])}</span>
                  </button>
                  <ul className={"dropdown__menu" + (this.state.open ? " is-visible" : "")}>
                    <li onClick={() => this.handleSort('score:desc')}>
                      <span>Most Popular</span>
                    </li>
                    <li onClick={() => this.handleSort('created_at:desc')}>
                      <span>Newest</span>
                    </li>
                    <li onClick={() => this.handleSort('updated_at:desc')}>
                      <span>Recently Updated</span>
                    </li>
                    <li onClick={() => this.handleSort('title:asc')}>
                      <span>Name</span>
                    </li>
                    <li onClick={() => this.handleSort('compatible_version:desc')}>
                      <span>Supported Sketch Version</span>
                    </li>
                  </ul>
                </div>
              </div>


            </div>
          </div>
        </div>

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
                onSelect={(page) => this.handlePagination(page)}
              />
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
