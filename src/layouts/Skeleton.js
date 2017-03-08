import React, { Component } from 'react'
import { Link } from 'react-router'

import SVGIcon from 'components/SVGIcon'

import 'normalize.css'
import 'css/milligram.scss'
import './skeleton.scss'

class Skeleton extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>

        {this.props.children}

      </div>
    )
  }
}
