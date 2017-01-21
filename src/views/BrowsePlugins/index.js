import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import qs from 'qs'
import linkHeader from 'parse-link-header'

import PluginList from 'components/PluginList'
import Pagination from 'components/Pagination'
import Icon from 'components/Icon'

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
    const { q, sort } = this.props.location.query
    this.fetchPage({page: page, q: q, sort: sort})
  }

  handleSort = (sort) => {
    const { dispatch } = this.props
    const { page, q } = this.props.location.query

    dispatch(pluginsSortBy(sort))
    this.fetchPage({page: page, q: q, sort: sort})
    this.handleToggle()
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }

  renderFilterLabel = (sort) => {
    switch (sort) {
      case 'score':
        return "Score"
      case 'updated_at':
        return "Recently updated"
      case 'title':
        return "Name"
      case 'stargazers_count':
        return "Stargazers"
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
                    <li>
                      <span onClick={() => this.handleSort('score:desc')}>Most Popular</span>
                    </li>
                    <li>
                      <span onClick={() => this.handleSort('updated_at:desc')}>Newest</span>
                    </li>
                    <li>
                      <span onClick={() => this.handleSort('stargazers_count:desc')}>Stargazers</span>
                    </li>
                    <li>
                      <span onClick={() => this.handleSort('title:asc')}>Name</span>
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
