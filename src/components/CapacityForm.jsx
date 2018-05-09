import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  input: {
    padding: theme.spacing.unit,
  },
});


class CapacityForm extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      wait: this.props.currentMaxWaiting,
      available: this.props.currentMaxAvailable,
    };
  }

  handleChange = (event) => {
    const updated = {};
    updated[event.target.id] = event.target.value;
    this.setState(updated);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.updateCapacity(this.state);
    // send the two requests to the server, one to update
    // available slots and the other to update wait slots.
  }


  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={8}>
        <form name="capacity update">
          <Grid item xs={12} className={classes.input}>
            <TextField id="wait" value={this.state.wait} label="Wait Capacity" onChange={this.handleChange} />
          </Grid>
          <Grid item xs={12} className={classes.input}>
            <TextField id="available" value={this.state.available} label="Max Available Slots" onChange={this.handleChange} />
          </Grid>
          <Grid item xs={12} className={classes.input}>
            <Button variant="raised" color="primary" onClick={this.handleSubmit} >Save</Button>
          </Grid>
        </form>
      </Grid>
    );
  }
}

CapacityForm.propTypes = {
  currentMaxWaiting: PropTypes.number.isRequired,
  currentMaxAvailable: PropTypes.number.isRequired,
  updateCapacity: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CapacityForm);
