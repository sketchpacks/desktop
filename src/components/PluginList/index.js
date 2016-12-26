import React from 'react'

import PluginMedia from 'components/PluginMedia'

const PluginList = ({ plugins }) => {
  return (
    <div>
      {plugins.map((plugin) => {
        return <PluginMedia plugin={plugin} key={plugin.id} />
      })}
    </div>
  )
}

export default PluginList
