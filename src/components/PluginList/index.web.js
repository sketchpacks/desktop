import React from 'react'

import PluginMedia from 'components/PluginMedia'

import './styles.scss'

const PluginList = ({ plugins, authorDetails }) => {
  if (plugins.isLoading) return (
    <div className="o-plugin-list">
      <div className="o-shelf o-shelf--centered">
        <em>Loading...</em>
      </div>
    </div>
  )

  if (plugins.items.length === 0) return (
    <div className="o-plugin-list">
      <div className="o-shelf o-shelf--centered">
        <em>No plugins found</em>
      </div>
    </div>
  )

  return (
    <div className="o-plugin-list">
      {plugins.items.map((plugin) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails

        return (
          <PluginMedia plugin={plugin} key={plugin.id} />
        )
      })}
    </div>
  )
}

export default PluginList
