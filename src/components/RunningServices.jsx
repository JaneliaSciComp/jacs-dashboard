import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import MessageSnack from './MessageSnack';
import getSettings from '../settings';

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


class RunningServices extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      error: null,
      running: null,
      loaded: false,
    };
  }

  componentDidMount() {
    const cookies = new Cookies();
    const jwt = cookies.get('userId');
    const { appId, jobListUrl } = getSettings();
    // load the running services.
    const runningServices = `${jobListUrl}?service-state=RUNNING`;
    fetch(runningServices, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': appId,
        Accept: 'application/json',
      },
      timeout: 5000,
    }).then(res => res.json())
      .then((json) => {
        this.setState({ running: json, loaded: true });
      }).catch(error => this.setState({ error }));
  }

  render() {
    const { classes } = this.props;
    const { avatarUrl } = getSettings();

    if (this.state.error) {
      return <MessageSnack messages="There was a problem contacting the server." />;
    }

    if (!this.state.loaded) {
      return (<Typography>Loading...</Typography>);
    }

    const services = this.state.running.resultList;

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography align="left" variant="h3">Running Services</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Started</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((n) => {
                  const url = `/job/${n.serviceId}`;


                  const [, username] = n.ownerKey.split(':');
                  const avatarSrc = avatarUrl.replace('<username>', username);

                  const auth = (
                    <Chip
                      avatar={<Avatar src={avatarSrc} />}
                      label={username}
                    />
                  );


                  return (
                    <TableRow key={n.serviceId}>
                      <TableCell>
                        <Link to={url}>{n.name}</Link>
                      </TableCell>
                      <TableCell>{auth}</TableCell>
                      <TableCell>{n.processStartTime}</TableCell>
                    </TableRow>
                  );
                })
                }
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

RunningServices.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RunningServices);
