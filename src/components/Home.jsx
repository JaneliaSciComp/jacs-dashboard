import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typ from 'material-ui/Typography';
import './Home.css';

class Home extends Component {
  render() {
    const { login } = this.props;

    return (
      <div className="Home">
        <Typ variant="title">
          Welcome to JACS Dashboard
        </Typ>
        {
          (login.get('loggedIn'))
            ? <Typ>You are logged in as: {login.get('username')}</Typ>
            : <Typ>Please login to continue</Typ>
        }

        <Typ>To get started, edit <code>src/Home.js</code> and save to reload.</Typ>
      </div>
    );
  }
}

Home.propTypes = {
  login: PropTypes.object.isRequired,
};

export default Home;
