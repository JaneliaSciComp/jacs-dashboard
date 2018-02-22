import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './Home.css';

class Home extends Component {
  render() {
    const { login } = this.props;
    return (
      <div className="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-title">Welcome to React</h1>
          <p>You are logged in as: {login.get('username')}</p>
        </header>
        <p className="Home-intro">
          To get started, edit <code>src/Home.js</code> and save to reload.
        </p>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

Home.propTypes = {
  login: PropTypes.object.isRequired,
};

export default Home;
