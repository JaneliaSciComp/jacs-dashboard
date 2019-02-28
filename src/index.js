import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router } from 'react-router-dom';
import thunkMiddleware from 'redux-thunk';
import Cookies from 'universal-cookie';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import './index.css';
import history from './history';
import reloadUserData from './lib/reloadUserData';
import App from './containers/App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunkMiddleware)));

const cookies = new Cookies();

const jwt = cookies.get('userId');

reloadUserData(store.dispatch, jwt).then(() => {
  ReactDOM.render(
    <Provider store={store}>
      { /* ConnectedRouter will use the store from Provider automatically */ }
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
});

registerServiceWorker();
