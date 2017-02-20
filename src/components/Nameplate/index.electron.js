import {
  WEB_URL
} from 'config'

import electron from 'electron'
import React from 'react'
import Nameplate from './nameplate'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)
    }

    handleClick () {
      electron.remote.shell.openExternal(`${WEB_URL}/@${this.props.handle}`)
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
          onClick={this.handleClick}
        />
      )
    }
  }

export default Connect(Nameplate)
