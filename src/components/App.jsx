import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';
import Navigation from '../containers/Navigation';
import Home from '../containers/Home';
import About from '../components/About';
import NoMatch from '../components/NoMatch';
import Login from '../containers/Login';
import PrivateRoute from '../containers/auth/PrivateRoute';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Reboot />
        <Navigation />
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

export default App;
