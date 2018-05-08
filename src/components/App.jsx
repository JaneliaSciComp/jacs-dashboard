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
import ServiceList from '../containers/ServiceList';
import Service from '../containers/Service';
import ServiceStart from '../containers/ServiceStart';
import Job from '../containers/Job';
import JobStatusList from '../containers/JobStatusList';
import ScheduledJobs from '../containers/ScheduledJobs';
import ScheduledJobDetails from '../containers/ScheduledJobDetails';
import PrivateRoute from '../containers/auth/PrivateRoute';
import AdminOnlyRoute from '../containers/auth/AdminOnlyRoute';
import RunningServices from './RunningServices';
import QueuedServices from './QueuedServices';
import Admin from '../containers/Admin';
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
              <PrivateRoute path="/services/scheduled" component={ScheduledJobs} />
              <PrivateRoute path="/services" component={ServiceList} />
              <PrivateRoute path="/running" component={RunningServices} />
              <PrivateRoute path="/queued" component={QueuedServices} />
              <AdminOnlyRoute path="/admin" component={Admin} />
              <PrivateRoute path="/service/:serviceName/start" component={ServiceStart} />
              <PrivateRoute path="/service/scheduled/:id" component={ScheduledJobDetails} />
              <PrivateRoute path="/service/:serviceName" component={Service} />
              <PrivateRoute exact path="/jobs" component={JobStatusList} />
              <PrivateRoute path="/job/:jobId" component={Job} />
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
