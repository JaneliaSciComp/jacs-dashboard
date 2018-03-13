import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import ScheduledTable from './ScheduledTable';

const styles = {
  row: {
    display: 'flex',
  },
};

class ScheduledJobs extends Component {
  componentDidMount() {
    this.props.actions.loadScheduledList();
  }

  render() {
    const { classes, scheduled } = this.props;

    let dataGrid = null;

    if (scheduled.get('data')) {
      const data = scheduled.get('data');
      dataGrid = <ScheduledTable data={data} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography align="left" variant="display2">Scheduled List</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="search"
              label="Filter"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            {dataGrid}
          </Grid>
        </Grid>
      </div>
    );
  }
}

ScheduledJobs.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  scheduled: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScheduledJobs);
