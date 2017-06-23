import React, { Component } from 'react'
import { connect } from 'react-redux'

class Preferences extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <h1>Preferences</h1>
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
  const { preferences } = state
  return {
    preferences
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( Preferences )
