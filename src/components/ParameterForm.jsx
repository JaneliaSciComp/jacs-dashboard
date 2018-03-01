import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
};

// Grab all the parameters and use the information provided to generate
// a form which can be used to submit a job


class ParameterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceName: this.props.name,
    };
    // now we need to loop over the parameters and set the initial state.
    this.props.data.forEach((arg) => {
      this.state[arg.argName] = arg.defaultValue;
    });

    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleSubmit = () => {
    // here we should package up the state and submit it to the backend
    // based on the service we are trying to invoke.
    const finalArgs = [];
    this.props.data.forEach((arg) => {
      finalArgs.push(arg.cmdFlags[0]);
      finalArgs.push(this.state[arg.argName]);
    });

    const postBody = {
      processingLocation: 'LOCAL',
      args: finalArgs,
    };

    this.props.submit(this.state.serviceName, postBody);
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
      value: this.state[data.argName] || '',
    };

    switch (data.argType) {
      case 'java.lang.Integer':
      case 'int':
      case 'java.lang.Long':
        params.type = 'number';
        input = <TextField {...params} onChange={this.handleChange(data.argName)} />;
        break;
      case 'boolean':
        input = <Switch value={this.state.foo} />;
        break;
      default:
        params.type = 'text';
        input = <TextField {...params} onChange={this.handleChange(data.argName)} />;
    }


    return (
      <Grid item xs={12} lg={12} key={data.argName}>
        <Grid container spacing={16} className={classes.root} alignItems="flex-end">
          <Grid item xs={3} >
            <Typography align="right">{data.argName}</Typography>
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
        <Button variant="raised" color="primary" onClick={this.handleSubmit}>Submit</Button>
      </Grid>
    );
  }
}

ParameterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
};

export default withStyles(styles)(ParameterForm);
