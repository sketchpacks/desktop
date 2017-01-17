import React from 'react'

import PluginMedia from 'components/PluginMedia'

import './styles.scss'

const PluginList = ({ plugins, authorDetails }) => {
  if (plugins.length === 0) return (<em>No plugins found</em>)

  return (
    <div className="o-plugin-list">
      {plugins.map((plugin) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails

        return (
          <PluginMedia plugin={plugin} />
        )
      })}
    </div>
  )
}

export default PluginList
