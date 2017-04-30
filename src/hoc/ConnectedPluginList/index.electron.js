import {
  __ELECTRON__,
  WEB_URL,
  API_URL
} from 'config'

import {remote} from 'electron'
import React from 'react'

import qs from 'qs'

import Waypoint from 'react-waypoint'
import { browsePlugins } from 'reducers/plugins'

const ConnectedPluginList = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount () {
      this.fetchData({
        page: this.props.state.plugins.meta.page || "1",
        append: false,
        sort: this.props.state.plugins.meta.sort,
      })
    }

    componentWillReceiveProps (nextProps) {
      // if (this.props.plugins.isLoading === true) return

      if (this.props.state.plugins.meta.sort !== nextProps.state.plugins.meta.sort) {
        this.fetchData({
          page: nextProps.state.plugins.meta.page,
          sort: nextProps.state.plugins.meta.sort,
          append: false,
          q: nextProps.state.plugins.meta.q,
        })
      }
    }

    fetchData ({ sort, page, append, q }) {
      const {dispatch,plugins} = this.props

      // if (this.props.state.plugins.isLoading === true) return

      const request_params = qs.stringify({
        sort,
        page,
        text: q
      })
      const request_url = `/plugins?${request_params}`

      dispatch(
        browsePlugins({
          url: request_url,
          append,
          list: this.props.state.plugins.meta.sort
        })
      )
    }

    render () {
      return (
        <div>
          <ComposedComponent
            fetchData={this.fetchData}
            state={this.props.state}
            location={this.props.location}
            dispatch={this.props.dispatch}
          />

          { (this.props.location.pathname !== '/library/installed'
              || this.props.location.pathname !== '/library/updates')
            // && !this.props.state.plugins.isLoading
            && this.props.state.plugins.allIdentifiers.length >= 9
            && <Waypoint
              onEnter={() => this.fetchData({
                sort: this.props.state.plugins.meta.sort,
                page: this.props.state.plugins.meta.nextPage,
                append: true
              })} /> }
        </div>
      )
    }
  }

export default ConnectedPluginList
