import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = {
  row: {
    display: 'flex',
  },
};

class ScheduledJobs extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.row}>
        <Typography align="center" variant="display2">Scheduled Jobs (cron)</Typography>
      </div>
    );
  }
}

ScheduledJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScheduledJobs);
