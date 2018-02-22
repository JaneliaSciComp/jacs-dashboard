import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import Topics from './Topics';

class About extends Component {
  render() {
    const { match } = this.props;
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
        <Link to={`${match.url}/topics`} >Topics</Link>
        <Route path={`${match.path}/topics`} component={Topics} />
      </div>
    );
  }
}

export default About;
