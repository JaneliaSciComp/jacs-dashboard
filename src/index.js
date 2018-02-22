import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, Switch } from 'react-router-dom';
import thunkMiddleware from 'redux-thunk';
import Cookies from 'universal-cookie';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import './index.css';
import Home from './containers/Home';
import Navigation from './containers/Navigation';
import About from './components/About';
import NoMatch from './components/NoMatch';
import Login from './containers/Login';
import history from './history';
import loadUserData from './lib/loadUserData';
import PrivateRoute from './containers/auth/PrivateRoute';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunkMiddleware)));

const cookies = new Cookies();

const jwt = cookies.get('userId');

loadUserData(store.dispatch, jwt).then(() => {
  ReactDOM.render(
    <Provider store={store}>
      { /* ConnectedRouter will use the store from Provider automatically */ }
      <Router history={history}>
        <div>
          <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
});

registerServiceWorker();
