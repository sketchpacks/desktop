const { ipcRenderer } = require('electron')

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getPreferences } from 'reducers'

class Preferences extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <h1>Preferences</h1>

        <strong>Sketchpack Sync</strong>
        <p>{this.props.preferences.syncing.sketchpack_path}</p>

        <button
          onClick={() => ipcRenderer.send('SELECT_FILE', 'PREFERENCE_SET_SKETCHPACK')
        }>
          Change
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

const mapStateToProps = (state, ownProps) => {
  return {
    preferences: getPreferences(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( Preferences )
