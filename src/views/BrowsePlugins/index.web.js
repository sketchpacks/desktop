import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Waypoint from 'react-waypoint'
import qs from 'qs'
import {SketchpacksApi} from 'api'

import PluginList from 'components/PluginList'

import {
  fetchCatalog,
  catalogSortBy
} from 'actions'

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.fetchData = this.fetchData.bind(this)
    this.renderListSorter = this.renderListSorter.bind(this)
  }

  componentDidMount () {
    this.fetchData({
      page: 1,
      append: false,
      sort: this.props.location.query.sort,
      text: this.props.location.query.q,
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.plugins.isLoading === true) return

    if (this.props.location.query.sort !== nextProps.location.query.sort) {
      this.fetchData({
        page: 1,
        sort: nextProps.location.query.sort,
        append: false
      })
    }
  }

  fetchData ({ sort, page, append, q }) {
    const {dispatch,plugins} = this.props

    if (plugins.isLoading === true) return

    const queryParams = qs.stringify({
      page: page || parseInt(plugins.nextPage),
      per_page: 10,
      sort: sort || plugins.sort,
      text: '' || q
    })

    dispatch(fetchCatalog(queryParams, append))
  }

  renderLoading () {
    return (
      <div className="container">
        <div className="row">
          <div className="column">
            <h4>Fetching more plugins...</h4>
          </div>
        </div>
      </div>
    )
  }

  renderListSorter () {
    return (
      <div className="button-group">
        <button type="button" className="button-clear button--dropdown" onClick={() => {}}>
          <span>Sort:</span>
          <span>{plugins.sort.split(':')[0]}</span>
        </button>
        <ul className={"dropdown__menu is-visible"}>
          <li onClick={() => dispatch(catalogSortBy('score:desc'))}>
            <span>Most Popular</span>
          </li>
          <li onClick={() => dispatch(catalogSortBy('created_at:desc'))}>
            <span>Newest</span>
          </li>
          <li onClick={() => dispatch(catalogSortBy('updated_at:desc'))}>
            <span>Recently Updated</span>
          </li>
          <li onClick={() => dispatch(catalogSortBy('title:asc'))}>
            <span>Name</span>
          </li>
          <li onClick={() => dispatch(catalogSortBy('compatible_version:desc'))}>
            <span>Supported Sketch Version</span>
          </li>
        </ul>
      </div>
    )
  }

  render () {
    const {plugins,dispatch} = this.props

    return (
      <div style={{position: 'relative'}}>
        <div className="container">
          <div className="row">
            <div className="column column__content">
              <PluginList
                plugins={plugins}
              />
            </div>
          </div>
        </div>


        { plugins.isLoading
          && this.renderLoading() }

        { !plugins.isLoading
          && plugins.items.length > 0
          && parseInt(plugins.nextPage) !== 1
          && parseInt(plugins.lastPage) >= parseInt(plugins.nextPage)
          && <Waypoint
              onEnter={() => this.fetchData({ sort: plugins.sort })} /> }
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
  const { catalog,search } = state

  return {
    plugins: catalog,
    search
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
