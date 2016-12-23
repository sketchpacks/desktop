import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from '../store/configureStore'

import App from '../containers/App'

import FrontPage from '../views/FrontPage'
import BrowsePlugins from '../views/BrowsePlugins'
import PopularPlugins from '../views/PopularPlugins'
import NewestPlugins from '../views/NewestPlugins'
import PluginDetails from '../views/PluginDetails'

import UserProfile from '../views/UserProfile'
import UserRecommends from '../views/UserRecommends'
import UserPlugins from '../views/UserPlugins'

let store = configureStore()

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={FrontPage} />
          <Route path="browse" component={BrowsePlugins} />
          <Route path="browse/popular" component={PopularPlugins} />
          <Route path="browse/newest" component={NewestPlugins} />

          <Route path="@:owner" component={UserProfile}>
            <IndexRedirect to="recommends" />
            <Route path="recommends" component={UserRecommends} />
            <Route path="plugins" component={UserPlugins} />
          </Route>

          <Route path=":owner/:id" component={PluginDetails} />

        </Route>
      </Router>
    </Provider>,

    document.getElementById('root')
  )
}
