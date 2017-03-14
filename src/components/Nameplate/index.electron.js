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
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }
  }

export default Connect(Nameplate)
