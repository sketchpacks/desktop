import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class UserProfileContainer extends Component {
  render () {
    const { owner } = this.props.params

    return (
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter">
            <figure className="image is-square">
              <img src="http://placehold.it/256x256" role="presentation" />
            </figure>
            <div className="content">
              <p className="title is-3">Adam Kirkwood</p>
              <p className="subtitle is-5">@adamkirkwood</p>
            </div>
          </div>

          <div className="column">
            <div className="tabs is-medium">
              <ul>
                <li><Link to={`/@${owner}/recommends`}>Recommends</Link></li>
                <li><Link to={`/@${owner}/plugins`}>Plugins</Link></li>
              </ul>
            </div>

            <div className="content">
              {this.props.children}
            </div>
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

function mapStateToProps(state, ownProps) {
  const { plugins } = state

  return {
    plugins
  }
}

export default connect(mapStateToProps, mapDispatchToProps)( UserProfileContainer )
