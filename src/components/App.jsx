import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Navigation from '../containers/Navigation';
import Home from '../containers/Home';
import About from '../components/About';
import NoMatch from '../components/NoMatch';
import Login from '../containers/Login';
import PrivateRoute from '../containers/auth/PrivateRoute';
import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#91f3ff',
      main: '#5bc0de',
      dark: '#1490ac',
      contrastText: '#000',
    },
    secondary: {
      light: '#a9ffc4',
      main: '#76d893',
      dark: '#43a665',
      contrastText: '#000',
    },
  },
  status: {
    danger: 'orange',
  },
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <Reboot />
          <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route component={NoMatch} />
          </Switch>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
