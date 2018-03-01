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
  componentDidMount() {
    this.props.actions.loadJobData(this.props.match.params.jobId);
  }

  render() {
    const { classes, job } = this.props;

    const data = job.get('data');

    if (!data || !Object.prototype.hasOwnProperty.call(data, 'serviceId')) {
      return (<div>loading...</div>);
    }

    return (
      <div className={classes.row}>
        <Typography align="center" variant="display2">Job Information ({data.serviceId}) </Typography>
        <p>{data.state}</p>
      </div>
    );
  }
}

Job.propTypes = {
  job: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
