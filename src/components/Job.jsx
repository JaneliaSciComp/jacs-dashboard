import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

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

    return [
      <div className={classes.row} key="1">
        <Typography align="center" variant="display1">Job Information ({data.serviceId}) </Typography>
      </div>,
      <div className={classes.row} key="type">
        <Typography>{data.name}</Typography>
      </div>,
      <div className={classes.row} key="2">
        <Typography>{data.state}</Typography>
      </div>,
      <div className={classes.row} key="3">
        <Typography>{format(parse(data.creationDate), 'YYYY/MM/DD, h:mmA')}</Typography>
      </div>,
    ];
  }
}

Job.propTypes = {
  job: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
