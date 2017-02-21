import React from 'react'

import PluginMedia from 'components/PluginMedia'

const PluginList = ({ plugins, authorDetails }) => {
  if (plugins.items.length === 0) return (<em>No plugins found</em>)

  return (
    <div className="container">
      {plugins.items.map((plugin, idx) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails

        return (
          <div className="row" key={`${idx}-${plugin.id}`}>
            <div className="column">
              <PluginMedia plugin={plugin} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PluginList
