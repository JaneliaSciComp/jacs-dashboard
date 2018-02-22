import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    const { component: ChildComponent, loggedIn, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          loggedIn ? (
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

PrivateRoute.propTypes = {
  location: PropTypes.object.isRequired,
  loggedIn: PropTypes.number.isRequired,
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.login.get('loggedIn'),
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
