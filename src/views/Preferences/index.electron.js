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

        <h3>Default Version Lock</h3>
        <p>Set your default version range for new plugins</p>

          <div className="o-media">
            <div className="o-media__left u-mar-right-x-small">
              <input
                type="radio"
                className="preference-radio"
                value="locked"
                checked={preferences.sketchpack.defaultLock === "locked"}
                onChange={(evt) => {
                  dispatch(
                    setPreference({
                      path: 'sketchpack.defaultLock',
                      value: evt.target.value
                    })
                  )
                }}
              />
            </div>

            <div className="o-media__content">
              <strong>Locked</strong>
              <p className="preference-description">Plugins are locked by default</p>
            </div>
          </div>

          <div className="o-media">
            <div className="o-media__left u-mar-right-x-small">
              <input
                type="radio"
                className="preference-radio"
                value="patch"
                checked={preferences.sketchpack.defaultLock === "patch"}
                onChange={(evt) => {
                  dispatch(
                    setPreference({
                      path: 'sketchpack.defaultLock',
                      value: evt.target.value
                    })
                  )
                }}
              />
            </div>

            <div className="o-media__content">
              <strong>Patch-level Lock</strong>
              <p className="preference-description">Allow patch-level updates by default</p>
            </div>
          </div>

          <div className="o-media">
            <div className="o-media__left u-mar-right-x-small">
              <input
                type="radio"
                className="preference-radio"
                value="minor"
                checked={preferences.sketchpack.defaultLock === "minor"}
                onChange={(evt) => {
                  dispatch(
                    setPreference({
                      path: 'sketchpack.defaultLock',
                      value: evt.target.value
                    })
                  )
                }}
              />
            </div>

            <div className="o-media__content">
              <strong>Minor-level Lock</strong>
              <p className="preference-description">Allow minor-level updates by default</p>
            </div>
          </div>

          <div className="o-media">
            <div className="o-media__left u-mar-right-x-small">
              <input
                type="radio"
                className="preference-radio"
                value="unlocked"
                checked={preferences.sketchpack.defaultLock === "unlocked"}
                onChange={(evt) => {
                  dispatch(
                    setPreference({
                      path: 'sketchpack.defaultLock',
                      value: evt.target.value
                    })
                  )
                }}
              />
            </div>

            <div className="o-media__content">
              <strong>Unlocked</strong>
              <p className="preference-description">Automatically apply all updates</p>
            </div>
          </div>


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
