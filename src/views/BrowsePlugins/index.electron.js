import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Waypoint from 'react-waypoint'
import qs from 'qs'
import linkHeader from 'parse-link-header'
import {SketchpacksApi} from 'api'

import PluginList from 'components/PluginList'

import {
  pluginsRequest,
  pluginsReceived,
  pluginsPaginate,
  pluginsSortBy
} from 'actions'

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentWillMount () {
    this.props.dispatch(pluginsRequest())
  }

  componentDidMount () {
    const { page, q, sort } = this.props.location.query
    this.fetchData({page: page || 1, q: q, sort: sort})
  }

  componentWillReceiveProps () {
    this.setState({ loading: false })
  }

  fetchData ({page, q, sort}) {
    const {dispatch,plugins,search} = this.props
    const {query} = this.props.location
    if (this.state.loading) return
    if (parseInt(plugins.nextPage) === 1
        && parseInt(plugins.nextPage) >= parseInt(plugins.lastPage)
        && plugins.items.length > 0) return

    this.setState({ loading: true })

    const sort_by = sort || plugins.sort_by

    const apiQuery = qs.stringify({
      ...query,
      sort: sort_by,
      per_page: 15,
      page: page || plugins.nextPage,
      text: q || search.keyword,
    })

    const browserQuery = qs.stringify({
      ...query,
      page: page,
      q: q || search.keyword,
      sort: sort_by,
    })

    SketchpacksApi.getCatalog({query: apiQuery})
      .then(response => {
        const pageMeta = linkHeader(response.headers.link)
        if (pageMeta) { dispatch(pluginsPaginate(pageMeta)) }

        dispatch(pluginsReceived(response.data))
        browserHistory.push(`/browse?${browserQuery}`)
      })
  }

  renderLoading () {
    return (
      <div className="container">
        <div className="row">
          <h4>Fetching more plugins...</h4>
        </div>
      </div>
    )
  }

  render () {
    const {plugins} = this.props

    return (
      <div style={{position: 'relative'}}>
        <PluginList
          plugins={plugins}
        />

        { this.state.loading
          && this.renderLoading() }

        { !this.state.loading
          && <Waypoint onEnter={this.fetchData} /> }
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
  const { plugins,search } = state

  return {
    plugins,
    search
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
