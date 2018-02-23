import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = {
  row: {
    display: 'flex',
  },
};

class Job extends Component {
  render() {
    const { classes, match } = this.props;
    return (
      <div className={classes.row}>
        <Typography align="center" variant="display2">Job Information ({match.params.jobId}) </Typography>
      </div>
    );
  }
}

Job.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
