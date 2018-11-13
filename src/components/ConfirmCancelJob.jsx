import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {};

class ConfirmCancelJob extends Component {

  handleCancel = () => {
    this.props.onClose(false);
  };

  handleOk = () => {
    this.props.onClose(true);
  };

  render() {
    return (
      <Dialog
        disableBackdropClick
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        {...this.props}
      >
        <DialogTitle id="confirmation-dialog-title">Terminate Job</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Do you want to terminate this job?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="secondary">
            No
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }  
}

ConfirmCancelJob.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(ConfirmCancelJob);
