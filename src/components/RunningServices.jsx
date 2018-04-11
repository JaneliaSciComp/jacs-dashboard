import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import MessageSnack from './MessageSnack';
import settings from '../settings.json';

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
  componentDidMount() {
    const { actions } = this.props;
    actions.loadCapacity();
  }


  render() {
    const { classes, stats } = this.props;

    if (stats.get('error')) {
      return <MessageSnack messages="There was a problem contacting the server." />;
    }

    if (!stats.get('cap_loaded')) {
      return (<Typography>Loading...</Typography>);
    }

    const services = stats.get('capacity').runningServices;


    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography align="left" variant="display2">Running Services</Typography>
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
                  const avatarSrc = settings.avatarUrl.replace('<username>', username);

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
  login: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(RunningServices);
