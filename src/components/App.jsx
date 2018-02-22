import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Link, Route } from 'react-router-dom';
import Navigation from '../containers/Navigation';
import Home from '../containers/Home';
import About from '../components/About';
import NoMatch from '../components/NoMatch';
import Login from '../containers/Login';
import PrivateRoute from '../containers/auth/PrivateRoute';

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="App">
        <Navigation />
        <Link to="/">Home</Link>
        <Link to="/about/topics" >Topics</Link>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
};

export default App;
