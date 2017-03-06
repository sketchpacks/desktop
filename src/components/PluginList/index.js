import React, {Component} from 'react'

import PluginMedia from 'components/PluginMedia'

import {map,includes} from 'lodash'

import './styles.scss'

const isInstalled = (library, pluginId) => {
  return includes(library, pluginId)
}

class PluginList extends Component {
  constructor (props) {
    super(props)

    this.renderLoadingState = this.renderLoadingState.bind(this)
    this.renderZeroState = this.renderZeroState.bind(this)
  }

  renderZeroState () {
    return (
      <div className="empty-state--expanded">
        <h4>Fetchin plugins...</h4>
      </div>
    )
  }

  renderLoadingState () {
    return (
      <div className="o-shelf">
        <h4>Loading plugins</h4>
      </div>
    )
  }

  render () {
    const {
      plugins,
      authorDetails,
      installedPluginIds,
      location,
      dispatch,
      handlePluginEvent,
      fetchData
    } = this.props

    // if ((plugins.items.length === 0) && plugins.isLoading) return this.renderZeroState()

    if (plugins.isLoading) return this.renderLoadingState()
    if (plugins.items.length === 0) return this.renderZeroState()

    return (
      <div className="o-plugin-list">

        {plugins.items.map((plugin, idx) => {

          // Set the owner property if not present
          if (!('owner' in plugin)) plugin['owner'] = authorDetails

          return <PluginMedia
            plugin={plugin}
            isInstalled={isInstalled(installedPluginIds, plugin.id)}
            location={location}
            dispatch={dispatch}
            handlePluginEvent={handlePluginEvent}
            fetchData={fetchData}
            key={`${idx}-${plugin.id}`} />
        })}
      </div>
    )
  }
}

export default PluginList
