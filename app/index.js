import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

class App extends React.Component {
  render () {
    return (
      <div>
        <h1>Hello, from Sketchpacks!</h1>
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/app/" component={App} />
  </Router>,

  document.getElementById('root')
)
