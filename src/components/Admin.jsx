import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

class Admin extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    const user = this.props.login.get('user');
    actions.loadCapacity(user.key);
  }

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="display2">Admin Page</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography>Admin Page</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

Admin.propTypes = {
  actions: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
};

export default Admin;
