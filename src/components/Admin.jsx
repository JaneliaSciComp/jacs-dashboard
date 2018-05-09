import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import CapacityForm from './CapacityForm';
import MessageSnack from './MessageSnack';

class Admin extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    const user = this.props.login.get('user');
    actions.loadCapacity(user.key);
  }

  render() {
    const { admin } = this.props;
    if (!admin.get('cap_loaded')) {
      return <Typography>Loading...</Typography>;
    }

    const capacity = admin.get('capacity');

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="display2">Admin Page</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography>Admin Page</Typography>
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
};

export default Admin;
