import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import './searchbar.scss'

import {
  search,
  searchResultsReceived
} from 'actions'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this.handleEnterKey = this.handleEnterKey.bind(this)
  }

  handleEnterKey (e) {
    if (e.key !== 'Enter') return

    if (e.target.value.length <= 2) return

    const {dispatch} = this.props
    const keyword = e.target.value

    dispatch(search(keyword))
    Catalog.search(keyword)
      .then(plugins => dispatch(searchResultsReceived(plugins)))

    this.props.router.push(`/search?q=${keyword}`)
  }

  render () {
    return (
      <input
        type="input"
        placeholder="Search all plugins"
        className="searchBar"
        onKeyUp={this.handleEnterKey}
      />
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
