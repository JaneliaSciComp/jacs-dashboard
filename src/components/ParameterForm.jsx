import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

const styles = {
  root: {
    flexGrow: 1,
  },
};

// Grab all the parameters and use the information provided to generate
// a form which can be used to submit a job
function buildFormRow(data, classes) {
  return (
    <Grid item xs={12} lg={12} key={data.argName}>
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={4}>
          <Typography>{data.argName}</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            id={data.argName}
            label={data.argName}
            type="text"
            margin="normal"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

class ParameterForm extends Component {
  render() {
    const { classes, data } = this.props;

    // for each parameter we need to look at its meta data and figure out
    // what type of form element would best suit that.
    const rows = data.map(argument => buildFormRow(argument, classes));

    return (
      <Grid container spacing={24}>
        {rows}
      </Grid>
    );
  }
}

ParameterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ParameterForm);
