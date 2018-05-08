import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';

class AdminOnlyRoute extends Component {
  render() {
    const {
      component: ChildComponent,
      loggedIn,
      isAdmin,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          (loggedIn && isAdmin) ? (
            <ChildComponent {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

AdminOnlyRoute.propTypes = {
  location: PropTypes.object.isRequired,
  loggedIn: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.login.get('loggedIn'),
  isAdmin: state.login.get('isAdmin'),
});

export default withRouter(connect(mapStateToProps)(AdminOnlyRoute));
