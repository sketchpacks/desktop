import React from 'react'

import PluginMedia from 'components/PluginMedia'

const PluginList = ({ plugins, authorDetails }) => {
  if (plugins.length === 0) return (
    <div className="row">
      <div className="column">
        <strong>No plugins found</strong>
      </div>
    </div>
  )

  return (
    <div className="container">
      {plugins.map((plugin) => {
        // Set the owner property if not present
        if (!('owner' in plugin)) plugin['owner'] = authorDetails

        return (
          <div className="row">
            <div className="column">
              <PluginMedia plugin={plugin} key={plugin.id} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PluginList
