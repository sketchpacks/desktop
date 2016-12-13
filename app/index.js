import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import { AppContainer } from 'react-hot-loader'

import App from './containers/App'

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,

    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./containers/App', render)
  }
}
