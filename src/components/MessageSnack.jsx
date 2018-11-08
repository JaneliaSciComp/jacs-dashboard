import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class MessageSnack extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showMessage: true,
    };
    // bind it and make it an instance method instead of prototype method
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ showMessage: false });
  }

  render() {
    const { messages } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.showMessage}
        autoHideDuration={6000}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{messages}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

export default MessageSnack;

MessageSnack.propTypes = {
  messages: PropTypes.string.isRequired,
};
