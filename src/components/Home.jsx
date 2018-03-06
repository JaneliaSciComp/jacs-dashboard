import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typ from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import './Home.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    'margin-top': '1em',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
});


class Home extends Component {
  componentDidMount() {
    const user = this.props.login.get('user');
    const username = user.key;
    this.props.actions.loadJobList(username);
  }

  jobsList() {
    if (!this.props.jobs.get('list_loaded')) {
      return (<Typ>Loading</Typ>);
    }
    return (
      <Typ>Showing ({this.props.jobs.get('list').resultList.length}) jobs</Typ>
    );
  }


  render() {
    const { login, classes } = this.props;

    const user = login.get('user');

    return [
      <Grid key="welcome" container spacing={24} className={classes.root}>
        <Grid item xs={12}>
          <Typ variant="title">
            Welcome to the JACS Dashboard
          </Typ>
        </Grid>
        <Grid item xs={12}>
          {
            (login.get('loggedIn'))
              ? <Typ>You are logged in as: {user.fullName} ({login.get('username')})</Typ>
              : <Typ>Please <Link to="/login">login</Link> to continue</Typ>
          }
        </Grid>
      </Grid>,
      <Grid key="contents" container spacing={24} className={classes.root}>
        <Grid item sm={4}>
          <Typ>Small charts here</Typ>
        </Grid>
        <Grid item sm={8}>
          {this.jobsList()}
        </Grid>
      </Grid>,
    ];
  }
}

Home.propTypes = {
  login: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  jobs: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
