import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import About from './components/About';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter as Router, Route } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <Router>
      <div>
        <Route exact path="/" component={App}/>
        <Route path="/about" component={About}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
