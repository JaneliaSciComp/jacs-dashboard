import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CapacityForm from './CapacityForm';
import MessageSnack from './MessageSnack';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    position: 'relative',
  },
});


class Admin extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    const user = this.props.login.get('user');
    actions.loadCapacity(user.key);
  }

  render() {
    const { admin, classes } = this.props;
    if (!admin.get('cap_loaded')) {
      return <Typography>Loading...</Typography>;
    }

    const capacity = admin.get('capacity');

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="h3">Admin Page</Typography>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Modify Processing Capacity</Typography>
            <CapacityForm
              currentMaxWaiting={capacity.waitingCapacity}
              currentMaxAvailable={capacity.availableSlots + capacity.runningServicesCount}
              updateCapacity={this.props.actions.updateCapacity}
            />
          </Paper>
          {admin.get('error') && <MessageSnack messages={admin.get('error').message} /> }
        </Grid>
      </Grid>
    );
  }
}

Admin.propTypes = {
  actions: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
