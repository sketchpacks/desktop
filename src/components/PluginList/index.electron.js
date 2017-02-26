import React from 'react'

import PluginMedia from 'components/PluginMedia'

import './styles.scss'

const PluginList = ({ plugins, authorDetails }) => {
  return (
    <div className="o-plugin-list">
      {plugins.items.map((plugin, idx) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails

        return <PluginMedia plugin={plugin} key={`${idx}-${plugin.id}`} />
      })}
    </div>
  )
}

export default PluginList
