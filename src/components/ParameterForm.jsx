import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import titleCase from 'title-case';

const styles = {
  root: {
    flexGrow: 1,
  },
};

// Grab all the parameters and use the information provided to generate
// a form which can be used to submit a job

class ParameterForm extends Component {
  componentDidMount() {
    // now we need to loop over the parameters and set the initial state.
    const updatedState = {};

    this.props.data.forEach((arg) => {
      updatedState[arg.argName] = arg.defaultValue;
    });
    this.setState(updatedState);
  }

  handleChange = arg => (event) => {
    this.props.actions.setParams(
      arg.argName,
      event.target.value,
    );
  }

  handleFlag = arg => (event) => {
    if (arg.arity == 0) {
      this.props.actions.setFlagParams(
          arg.argName,
          event.target.checked,
      );
    } else {
      this.props.actions.setParams(
          arg.argName,
          event.target.checked,
      );
    }
  }

  buildFormRow(data, classes) {
    // use the argType attribute to determine which type of form input to use.
    let input = null;

    const params = {
      id: data.argName,
      label: data.argName,
      fullWidth: true,
      margin: 'normal',
      required: data.required,
      value: this.props.args.get(data.argName) || '',
    };

    switch (data.argType) {
      case 'int':
      case 'java.lang.Integer':
      case 'long':
      case 'java.lang.Long':
        params.type = 'number';
        input = <TextField {...params} onChange={this.handleChange(data)} />;
        break;
      case 'boolean':
      case 'java.lang.Boolean':
        input = <Switch value={data.argName} checked={data.value} onChange={this.handleFlag(data)} />;
        break;
      default:
        params.type = 'text';
        input = <TextField {...params} onChange={this.handleChange(data)} />;
    }

    return (
      <Grid item xs={12} lg={12} key={data.argName}>
        <Grid container spacing={16} className={classes.root} alignItems="flex-end">
          <Grid item xs={3}>
            <Typography align="right">{titleCase(data.argName)}</Typography>
          </Grid>
          <Grid item xs={4}>
            {input}
          </Grid>
          <Grid item xs={5}>
            <Typography>{data.description}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes, data } = this.props;

    // for each parameter we need to look at its meta data and figure out
    // what type of form element would best suit that.
    const rows = data.map(argument => this.buildFormRow(argument, classes));

    return (
      <Grid container spacing={24}>
        {rows}
      </Grid>
    );
  }
}

ParameterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  args: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParameterForm);
