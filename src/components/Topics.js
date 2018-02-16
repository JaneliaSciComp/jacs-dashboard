import React, { Component } from 'react';
import logo from './logo.svg';

class Topics extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Topics</h1>
        </header>
        <p className="App-intro">
          Topics page.
        </p>
      </div>
    );
  }
}

export default Topics;
