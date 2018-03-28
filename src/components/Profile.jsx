import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typ from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import { isAdminUser } from '../lib/user-utility';
import './Home.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    'margin-top': '1em',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  avatar: {
    margin: 10,
  },
  icon: {
    color: '#aed581',
  },
});


class Profile extends Component {
  render() {
    const { login, classes } = this.props;
    const user = login.get('user');
    const initials = user.fullName.split(' ').map(name => name.charAt(0)).join('');

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>{initials}</Avatar>
              <Typ>Name: {user.fullName}</Typ>
              <Typ>Email: {user.email}</Typ>
              <Typ>Admin: {isAdminUser(user) ? <Icon className={classes.icon}>check_circle</Icon> : '' }</Typ>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Profile.propTypes = {
  login: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
