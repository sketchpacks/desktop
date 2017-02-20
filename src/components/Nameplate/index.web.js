import React from 'react'
import { Link } from 'react-router'
import Nameplate from './nameplate'

const Connect = ComposedComponent =>
  class extends React.Component {
    constructor (props) {
      super(props)
    }

    render () {
      const {handle} = this.props
      return (
        <Link to={`/@${handle}`}>
          <ComposedComponent
            {...this.props}
          />
        </Link>
      )
    }
  }

export default Connect(Nameplate)
