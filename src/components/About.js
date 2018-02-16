import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';

class About extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">About</h1>
        </header>
        <p className="App-intro">
          About page.
        </p>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export default About;
