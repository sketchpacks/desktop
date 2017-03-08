import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'

import App from 'containers/App'
import Skeleton from 'layouts/Skeleton'

import FrontPage from 'views/FrontPage'
import BrowsePlugins from 'views/BrowsePlugins'
import SearchResults from 'views/SearchResults'
import PluginDetails from 'views/PluginDetails'

import UserProfile from 'views/UserProfile'
import UserRecommends from 'views/UserRecommends'
import UserPlugins from 'views/UserPlugins'

let store = configureStore()

export const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Skeleton}>
          <IndexRoute component={FrontPage} />

          <Route component={App}>
            <Route path="browse" component={BrowsePlugins} />
            <Route path="search" component={BrowsePlugins} />

            <Route path="@:owner" component={UserProfile}>
              <IndexRedirect to="plugins" />
              <Route path="plugins" component={UserPlugins} />
            </Route>

            <Route path=":owner/:id" component={PluginDetails} />
          </Route>

        </Route>
      </Router>
    </Provider>,

    document.getElementById('root')
  )
}
