import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux'

import qs from 'qs'
import linkHeader from 'parse-link-header'

import {
  pluginsRequest,
  pluginsReceived,
  pluginsPaginate,
  search,
  searchResultsReceived
} from 'actions'

import './styles.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.fetchPage = this.fetchPage.bind(this)
  }

  fetchPage = ({page = 1, text, sort = 'created_at'}) => {
    const { dispatch } = this.props
    const { query } = this.props.location

    const sort_by = sort || this.props.plugins.sort_by

    const apiQuery = qs.stringify({...query, page: page, text: text, sort: `${sort_by}:desc`, per_page: 10})
    const browserQuery = qs.stringify({...query, q: text, page: page})

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

  handleEnterKey (e) {
    if (e.key !== 'Enter') return

    if (e.target.value.length <= 2) return

    const {dispatch} = this.props
    const keyword = e.target.value

    dispatch(search(keyword))
    this.fetchPage({ text: keyword })
  }

  render () {
    return (
      <div>
        <input
        type="text"
        placeholder="Search all plugins"
        className="searchBar"
        onKeyUp={this.handleEnterKey}
        />
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
  return {
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( SearchBar )
