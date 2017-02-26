import {
  __ELECTRON__,
} from 'config'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux'

import SVGIcon from 'components/SVGIcon'

import qs from 'qs'
import linkHeader from 'parse-link-header'
import {SketchpacksApi} from 'api'

import {
  pluginsRequest,
  pluginsReceived,
  pluginsPaginate,
  fetchSearchRequest,
  fetchSearchReceived,
  fetchSearchError,
  fetchSearch
} from 'actions'

import './styles.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.fetchPage = this.fetchPage.bind(this)
  }

  fetchPage = ({page = 1, text, sort = 'created_at'}) => {
    const {dispatch} = this.props
    dispatch(fetchSearch(text))
    browserHistory.push(`/search?q=${text}`)
  }

  handleEnterKey (e) {
    if (e.key !== 'Enter') return

    if (e.target.value.length <= 2) return

    const {dispatch} = this.props
    const keyword = e.target.value

    this.fetchPage({ text: keyword })
  }

  render () {
    return (
      <div className="searchBar__container">
        <input
          className={this.props.classNames}
          type="text"
          placeholder="Search all plugins"
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
