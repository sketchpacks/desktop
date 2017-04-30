import React, {Component} from 'react'

import PluginMedia from 'components/PluginMedia'
import BrowseError from 'components/BrowseError'

import {
  getPluginByIdentifier,
  selectPlugin
} from 'reducers'

import './styles.scss'

class PluginList extends Component {
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
      return (
        <div>
          <h1>empty...</h1>
        </div>
      )
    }

    return (
      <div className="o-plugin-list">

        {plugins.map((identifier, idx) => {
          return <PluginMedia
            key={`${idx}-${identifier}`}
            plugin={selectPlugin(state,identifier)}
            location={location}
            dispatch={dispatch}
            handlePluginEvent={handlePluginEvent} />
        })}
      </div>
    )
  }
}

export default PluginList
