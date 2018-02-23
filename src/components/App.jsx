import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';
import { withStyles, MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Navigation from '../containers/Navigation';
import Home from '../containers/Home';
import About from '../components/About';
import NoMatch from '../components/NoMatch';
import Login from '../containers/Login';
import Profile from '../containers/Profile';
import PrivateRoute from '../containers/auth/PrivateRoute';
import './App.css';

const styles = {
  root: {
    flexGrow: 1,
  },
  content: {
    padding: '1rem',
  },
};

const theme = createMuiTheme({
  palette: {
    type: 'light',
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <Reboot />
          <Navigation />
          <div className={classes.content}>
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute path="/profile" component={Profile} />
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
