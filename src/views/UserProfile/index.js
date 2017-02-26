import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  fetchUser
} from 'actions'

import Nameplate from 'components/Nameplate'

import './style.scss'

class UserProfileContainer extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const { owner } = this.props.params

    dispatch(fetchUser(owner))
  }

  render () {
    const { authorDetails } = this.props

    return (
      <div>
        <div className="hero">
          <div className="container spaced-between">
            <div className="row">
              <div className="column">
                <Nameplate
                  handle={authorDetails.handle}
                  thumbnailUrl={authorDetails.avatar_url}
                  name={authorDetails.name}
                  height={24}
                  width={24}
                />

                <h2>{authorDetails.name || authorDetails.handle}</h2>
              </div>
            </div>

            <div className="row">
              <div className="column">
                <div className="tabnav">
                  <nav className="tabnav-tabs">
                    <Link to={`/@${authorDetails.handle}/plugins`} className="tabnav-tab" activeClassName="selected">Published</Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.props.children}
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
  const { authorDetails } = state

  return {
    authorDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserProfileContainer )
