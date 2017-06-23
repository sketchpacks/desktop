const { ipcRenderer } = require('electron')

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Preferences extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    console.log(this.props.preferences)

    return (
      <div style={{position: 'relative'}}>
        <h1>Preferences</h1>

        <button
          onClick={() => ipcRenderer.send('SELECT_FILE', 'PREFERENCE_SET_SKETCHPACK')
        }>
          Change location
        </button>
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
