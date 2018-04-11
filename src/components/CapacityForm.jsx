import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

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
    return (
      <form name="capacity update">
        <TextField id="wait" value={this.state.wait} label="Wait Capacity" onChange={this.handleChange} />
        <TextField id="available" value={this.state.available} label="Max Available Slots" onChange={this.handleChange} />
        <Button variant="raised" color="primary" onClick={this.handleSubmit} >Save</Button>
      </form>
    );
  }
}

CapacityForm.propTypes = {
  currentMaxWaiting: PropTypes.number.isRequired,
  currentMaxAvailable: PropTypes.number.isRequired,
  updateCapacity: PropTypes.func.isRequired,
};

export default CapacityForm;
