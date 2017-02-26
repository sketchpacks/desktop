import React from 'react'

const ConnectedPluginList = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.fetchData = this.fetchData.bind(this)
      this.renderLoading = this.renderLoading.bind(this)
    }

    componentDidMount () {
      this.fetchData({
        page: 1,
        append: false,
        sort: this.props.location.query.sort,
        q: this.props.location.query.q
      })
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.plugins.isLoading === true) return

      if (this.props.location.query.sort !== nextProps.location.query.sort) {
        this.fetchData({
          page: 1,
          sort: nextProps.location.query.sort,
          append: false,,
          q: this.props.location.query.q
        })
      }
    }

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
        <ComposedComponent
          plugin={this.props.plugin}
          state={this.props.state}
          dispatch={this.props.dispatch}
          handlePluginEvent={this.handlePluginEvent} />
      )
    }
  }

export default ConnectedPluginList
