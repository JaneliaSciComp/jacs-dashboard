import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1rem',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  noAccount: {
    marginTop: theme.spacing.unit * 2,
  },
});

class LoginView extends React.Component {
  constructor(...args) {
    super(...args);
    // bind it and make it an instance method instead of prototype method
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { loginValidate } = this.props.actions;
    loginValidate(this.username.value, this.password.value);
  }

  handleClose() {
    // need to remove the error message from the state.
    this.props.actions.loginErrorClear();
  }

  render() {
    const { state, classes } = this.props;

    // if you are already logged in, then redirect to the home page
    if (state.get('loggedIn')) {
      return <Redirect to="/" />;
    }

    let button = <Button variant="raised" color="primary" type="submit">Submit</Button>;

    if (state.get('loading') === 1) {
      button = <Typography>Loading...</Typography>;
    }

    let error = '';

    if (state.get('error')) {
      error = (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={Boolean(state.get('error'))}
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={state.get('error').message}
        />
      );
    }


    return (
      <Grid id="login-view" container spacing={24} className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Paper elevation={1} className={classes.paper}>
              <Typography variant="display2">Login</Typography>
              <form name="login-form" method="post" action="login" onSubmit={this.handleSubmit}>
                <TextField
                  id="username"
                  label="Username"
                  inputRef={(input) => { this.username = input; }}
                  fullWidth
                />

                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                  inputRef={(input) => { this.password = input; }}
                  fullWidth
                />


                {button}
              </form>
              {error}
              {this.props.children}
              <Typography className={classes.noAccount}>Don&apos;t have an account? Contact <a href="mailto:workstation-support@janelia.hhmi.org?subject=[JW] Workstation Access Request&body=I'd like to request access to [describe the data set you are requesting] data in the Janelia Workstation.">Scientific Computing</a> and we will create one for you.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

LoginView.propTypes = {
  actions: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

LoginView.defaultProps = {
  children: null,
};

export default withStyles(styles)(LoginView);
