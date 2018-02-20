import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class Topics extends Component {
  render() {
    const { location } = this.props;
    return (
      <div>
        <p>You are now at {location.pathname}</p>
        <Link to='/bar'>Missing</Link>
      </div>
    );
  }
}

Topics.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(Topics);
