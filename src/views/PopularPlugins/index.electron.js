import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { getPopularPlugins } from 'selectors'

import { CellMeasurer, AutoSizer, List } from 'react-virtualized'

import PluginList from 'components/PluginList'
import PluginMedia from 'components/PluginMedia'

import 'react-virtualized/styles.css'

class PopularPluginsContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { plugins } = this.props

    const listProps = {
      width: 560,
      height: 486,
      rowHeight: 245,
      rowCount: plugins.length,
      rowRenderer: ({ key, index, isScrolling, isVisible, style }) => {
        return (
          <div className="row" key={key} style={style}>
            <div className="column">
              <PluginMedia plugin={plugins[index]} />
            </div>
          </div>
        )
      }
    }

    return (
      <div>
        <div className="container">
          <List
            {...listProps}
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

function mapStateToProps(state, ownProps) {
  const { plugins } = state

  return {
    state,
    plugins: getPopularPlugins(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( PopularPluginsContainer )
