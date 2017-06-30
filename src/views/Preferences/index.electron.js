const { ipcRenderer } = require('electron')

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { syncHistoryWithStore,goBack } from 'react-router-redux'

import { getPreferences } from 'reducers'

import { setPreference } from 'reducers/preferences'

import SVGIcon from 'components/SVGIcon'

import Switch from 'rc-switch'

import './preferences.scss'

class Preferences extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { preferences,dispatch } = this.props
    return (
      <div className="preferences">
        <h1>Preferences</h1>

        <a
          href="#"
          className={'preferences-close'}
          onClick={() => dispatch(goBack())}>
          <SVGIcon icon={'x'} shape={'polygon'} size={'24'} />
        </a>

        <h2>Sketchpack</h2>
        <p>Plugins defined in the sketchpack are added to Managed Library</p>

        <p className="preference-description">Manage plugins using the sketchpack located at:</p>
        <div className="preference-preview">
          { preferences.sketchpack.location }
        </div>

        <button
          onClick={() => ipcRenderer.send('SELECT_FILE', 'PREFERENCE_SET_SKETCHPACK')
        }>
          Change
        </button>

        <hr />

        <h2>Shared Libraries</h2>
        <p>Sync your Managed Library across multiple teams</p>

        <div className="o-media u-mar-bottom-x-small">
          <div className="o-media__content">
            <h3>Installing plugins</h3>
            <p className="preference-description">Automatically install plugins added to your sketchpack</p>
          </div>

          <div className="o-media__right">
            <Switch
              checked={preferences.syncing.enabled}
              onChange={(value) => {
                dispatch(
                  setPreference({
                    path: 'syncing.enabled',
                    value
                  })
                )

                dispatch({
                  type: 'behavior_tracking',
                  meta: {
                    mixpanel: {
                      eventName: 'Manage',
                      type: value ? 'Syncing Enabled' : 'Syncing Disabled'
                    }
                  }
                })
              }}
            />
          </div>
        </div>

        <div className="o-media">
          <div className="o-media__content">
            <h3>Removing plugins</h3>
            <p className="preference-description">Automatically uninstall plugins removed from your sketchpack</p>
          </div>

          <div className="o-media__right">
            <Switch
              checked={preferences.syncing.overwatch}
              onChange={(value) => {
                  dispatch(
                    setPreference({
                      path: 'syncing.overwatch',
                      value
                    })
                  )

                  dispatch({
                    type: 'behavior_tracking',
                    meta: {
                      mixpanel: {
                        eventName: 'Manage',
                        type: value ? 'Overwatch Enabled' : 'Overwatch Disabled'
                      }
                    }
                  })
                }
              }
            />
          </div>
        </div>

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
    sketchpack: state.sketchpack,
    preferences: getPreferences(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( Preferences )
