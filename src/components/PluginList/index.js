import React, {Component} from 'react'

import PluginMedia from 'components/PluginMedia'

import {map,includes,findIndex} from 'lodash'

import './styles.scss'

class PluginList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      plugins,
      authorDetails,
      location,
      dispatch,
      handlePluginEvent,
      fetchData,
      state
    } = this.props

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
