import React, {Component} from 'react'

import LibraryMedia from 'components/LibraryMedia'
import BrowseError from 'components/BrowseError'
import EmptyStateSwitcher from 'components/EmptyStateSwitcher'

import {
  getPluginByIdentifier,
  selectPluginBasics
} from 'reducers'

import './styles.scss'

class LibraryList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      plugins,
      location,
      dispatch,
      handlePluginEvent,
      state,
      errorMessage,
      onRetry
    } = this.props

    if (errorMessage && plugins.length === 0) {
      return <BrowseError
        message={errorMessage}
        onRetry={onRetry} />
    }

    if (plugins.length === 0) {
      return <EmptyStateSwitcher pathname={this.props.location.pathname} />
    }

    return (
      <div className="o-plugin-list">

        {plugins.map((identifier, idx) => {
          return <LibraryMedia
            key={`${idx}-${identifier}`}
            plugin={selectPluginBasics(state,identifier)}
            location={location}
            dispatch={dispatch}
            handlePluginEvent={handlePluginEvent} />
        })}
      </div>
    )
  }
}

export default LibraryList
