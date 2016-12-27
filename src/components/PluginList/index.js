import React from 'react'

import PluginMedia from 'components/PluginMedia'

const PluginList = ({ plugins, authorDetails }) => {
  if (plugins.length === 0) return (<em>Loading...</em>)

  return (
    <div>
      {plugins.map((plugin) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails
        
        return <PluginMedia plugin={plugin} key={plugin.id} />
      })}
    </div>
  )
}

export default PluginList
