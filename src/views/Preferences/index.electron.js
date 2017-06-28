const { ipcRenderer } = require('electron')

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { syncHistoryWithStore,goBack } from 'react-router-redux'

import { getPreferences } from 'reducers'

import SVGIcon from 'components/SVGIcon'

import './preferences.scss'

class Preferences extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="preferences">
        <h1>Preferences</h1>

        <a
          href="#"
          className={'preferences-close'}
          onClick={() => this.props.dispatch(goBack())}>
          <SVGIcon icon={'x'} shape={'polygon'} size={'24'} />
        </a>

        <h2>Syncing</h2>
        <p className="preference-description">Sync your managed library with your sketchpack located at:</p>

        <div className="preference-preview">
          { this.props.preferences.syncing.sketchpack_path }
        </div>

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
