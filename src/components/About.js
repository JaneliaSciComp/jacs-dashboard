import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import Topics from './Topics';

class About extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-title">About</h1>
        </header>
        <p className="Home-intro">
          About page.
        </p>
        <Link to="/">Home</Link>
        <Link to={`${match.url}/topics`} >Topics</Link>
        <Route path={`${match.path}/topics`} component={Topics} />
      </div>
    );
  }
}

About.propTypes = {
  match: PropTypes.object.isRequired,
};

export default About;
