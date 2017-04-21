import React, {Component} from 'react'

import PluginMedia from 'components/PluginMedia'

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
      handlePluginEvent
    } = this.props

    if (!plugins) {
      return (
        <div>
          <h1>empty...</h1>
        </div>
      )
    }

    return (
      <div className="o-plugin-list">

        {plugins.map((plugin, idx) => {
          return <PluginMedia
            plugin={plugin}
            isInstalled={ false }
            location={location}
            dispatch={dispatch}
            handlePluginEvent={handlePluginEvent}
            key={`${idx}-${plugin.id}`} />
        })}
      </div>
    )
  }
}

export default PluginList
