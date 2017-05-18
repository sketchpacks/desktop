import {
  __ELECTRON__,
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux'

import SVGIcon from 'components/SVGIcon'

import qs from 'qs'

import { searchPlugins } from 'reducers/search'

import './styles.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  fetchData ({ sort, page, append, q }) {
    const {dispatch} = this.props

    const request_params = qs.stringify({
      sort: 'score:desc',
      page,
      text: q
    })
    const request_url = `/plugins?${request_params}`

    dispatch(push(`/search?q=${q}`))

    dispatch(
      searchPlugins({
        url: request_url,
        append: false,
        list: 'search',
        keyword: q
      })
    )
  }

  handleEnterKey (e) {
    if (e.key !== 'Enter') return

    if (e.target.value.length <= 2) return

    this.fetchData({ q: e.target.value })
  }

  render () {
    return (
      <div className="searchBar__container">
        <input
          className={this.props.classNames}
          type="text"
          placeholder={this.props.location.query.q
            ? this.props.location.query.q
            : "Search all plugins"}
          defaultValue={this.props.location.query.q
            ? this.props.location.query.q
            : ""}
          onKeyUp={this.handleEnterKey}
        />
        <SVGIcon
          icon={'search'}
          shape={'path'}
          fill={'#B1B4BA'}
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
