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
    this.handleFilterSelect = this.handleFilterSelect.bind(this)
    this.showSortList = this.showSortList.bind(this)
    this.hideSortList = this.hideSortList.bind(this)

    this.state = {
      sortListVisible: false
    }
  }

  componentDidMount () {
    const { page, q } = this.props.location.query
    this.fetchPage({page: page, q: q})
  }

  fetchPage = ({page = 1, q, sort = 'updated_at:desc'}) => {
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

  handleFilterSelect = (sort) => {
    const { dispatch } = this.props
    const { page, q } = this.props.location.query

    dispatch(pluginsSortBy(sort))
    this.fetchPage({page: page, q: q, sort: sort})
  }

  showSortList = () => {
    this.setState({ sortListVisible: true })
    document.addEventListener("click", this.hideSortList)
  }

  hideSortList = () => {
    this.setState({ sortListVisible: false })
    document.removeEventListener("click", this.hideSortList)
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

                <div className="dropdown">
                  <div className="dropdown__display" onClick={this.showSortList}>
                    <span>Sort:</span>
                    <span>{plugins.sort_by}</span>
                    <Icon icon={'arrow_down'} shape={'polygon'} size={'1em'} />
                  </div>

                  <div className={"dropdown__list" + (this.state.sortListVisible ? " is-visible" : "")}>
                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('score:desc')}>Most Popular</span>
                    </div>

                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('updated_at:desc')}>Newest</span>
                    </div>

                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('stargazers_count:desc')}>Stargazers</span>
                    </div>

                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('version:desc')}>Latest Version</span>
                    </div>

                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('title:asc')}>Name</span>
                    </div>

                    <div className="dropdown__list-item">
                      <span onClick={() => this.handleFilterSelect('compatible_version:desc')}>Compatibile Version</span>
                    </div>
                  </div>

                </div>
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
