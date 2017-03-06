import React from 'react'

import qs from 'qs'
import {SketchpacksApi} from 'api'


import Waypoint from 'react-waypoint'

import {
  fetchCatalog
} from 'actions'

const ConnectedPluginList = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.fetchData = this.fetchData.bind(this)
      this.renderLoading = this.renderLoading.bind(this)

      this.handleInstall = this.handleInstall.bind(this)
      this.handlePluginEvent = this.handlePluginEvent.bind(this)
    }

    handleInstall (plugin) {
      window.location = `sketchpacks://install/${plugin.id}`
    }

    handlePluginEvent ({ type, plugin }) {
      const {dispatch} = this.props

      switch (type) {
        case "install":
          return this.handleInstall(plugin)
        case "favorite":
          return console.log(type, plugin)
        case "collect":
          return console.log(type, plugin)
      }
    }

    componentDidMount () {
      this.fetchData({
        page: 1,
        append: false,
        q: '',
        sort: 'score:desc',
      })
    }

    // componentWillReceiveProps (nextProps) {
    //   if (this.props.plugins.isLoading === true) return
    //
    //   if (this.props.location.query.sort !== nextProps.location.query.sort) {
    //     this.fetchData({
    //       page: 1,
    //       sort: nextProps.location.query.sort || 'score:desc',
    //       append: false,
    //       q: nextProps.location.query.q || '',
    //     })
    //   }
    // }

    fetchData ({ sort, page, append, q }) {
      const {dispatch,plugins} = this.props

      if (plugins.isLoading === true) return

      const queryParams = qs.stringify({
        page: page || parseInt(plugins.nextPage),
        per_page: 10,
        sort: sort || plugins.sort,
        text: q || null
      })

      dispatch(fetchCatalog(queryParams, append))
    }

    renderLoading () {
      return (
        <div className="container">
          <div className="row">
            <h4>Fetching more plugins...</h4>
          </div>
        </div>
      )
    }

    render () {
      return (
        <div>
          <ComposedComponent
            fetchData={this.fetchData}
            handlePluginEvent={this.handlePluginEvent}

            plugins={this.props.plugins}
            state={this.props.state}
            location={this.props.location}
            dispatch={this.props.dispatch}
          />

          { !this.props.plugins.isLoading
            && this.props.plugins.items.length > 0
            && parseInt(this.props.plugins.nextPage) !== 1
            && parseInt(this.props.plugins.lastPage) >= parseInt(this.props.plugins.nextPage)
            && <Waypoint
            onEnter={() => this.fetchData({ sort: this.props.plugins.sort })} /> }
        </div>
      )
    }
  }

export default ConnectedPluginList
