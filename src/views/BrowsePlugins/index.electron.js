import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Waypoint from 'react-waypoint'
import qs from 'qs'
import linkHeader from 'parse-link-header'
import {SketchpacksApi} from 'api'

import PluginList from 'components/PluginList'

import {
  fetchPluginsReceived,
  pluginsPaginate,
  pluginsSortBy,
  fetchCatalog
} from 'actions'

class BrowsePluginsContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount () {
    const { page, q, sort } = this.props.location.query

    if (this.props.plugins.items.length === 0 && !this.state.loading) {
      this.fetchData({
        page: page || 1,
        q: q,
        sort: sort
      })
    }
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

    const apiQuery = qs.stringify({
      ...query,
      sort: sort || plugins.sort_by,
      page: page || plugins.nextPage,
      per_page: 15,
      text: q || search.keyword,
    })

    const browserQuery = qs.stringify({
      ...query,
      q: q || search.keyword,
      page: page,
      per_page: 15,
      sort: sort || plugins.sort_by,
    })

    dispatch(fetchCatalog(apiQuery))
    browserHistory.push(`/browse?${browserQuery}`)
    this.setState({ loading: false })

    // SketchpacksApi.getCatalog({query: apiQuery})
    //   .then(response => {
    //     const pageMeta = linkHeader(response.headers.link)
    //     if (pageMeta) { dispatch(pluginsPaginate(pageMeta)) }
    //
    //     dispatch(fetchPluginsReceived(response.data))
    //     browserHistory.push(`/browse?${browserQuery}`)
    //     this.setState({ loading: false })
    //   })
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
          && plugins.items.length > 0
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
  const { catalog,search } = state

  return {
    plugins: catalog,
    search
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( BrowsePluginsContainer )
