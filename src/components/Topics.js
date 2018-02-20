import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { Route, Link } from 'react-router-dom';

class Topics extends Component {
  render() {
    const { match, location, history } = this.props
    return (
      <div>
        <p>You are now at {location.pathname}</p>
        <Link to='/bar'>Missing</Link>
      </div>
    );
  }
}

export default withRouter(Topics);
