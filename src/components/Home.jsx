import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typ from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
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
  render() {
    const { login, classes } = this.props;

    return (
      <Grid id="login-view" container spacing={24} className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Paper elevation={1} className={classes.paper}>
              <Typ variant="title">
                Welcome to the JACS Dashboard
              </Typ>
              {
                (login.get('loggedIn'))
                  ? <Typ align="center">You are logged in as: {login.get('username')}</Typ>
                  : <Typ align="center">Please login to continue</Typ>
              }
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  login: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
