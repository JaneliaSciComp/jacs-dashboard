import React from 'react';
import PropTypes from 'prop-types';

export default class LoginView extends React.Component {
  constructor(...args) {
    super(...args);
    // bind it and make it an instance method instead of prototype method
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { loginValidate } = this.props.actions;
    loginValidate(this.username.value, this.password.value);
  }

  render() {
    const { state } = this.props;

    let button = <button className="btn btn-outline-info btn-sm">Submit</button>;

    if (state.get('loading') === 1) {
      button = <p>Loading...</p>;
    }

    let error = '';

    if (state.get('error')) {
      error = <div className="alert alert-danger">{state.get('error')}</div>;
    }

    return (
      <div id="login-view" className="row">
        <div className="col-sm-4 offset-sm-4 ">
          <h2>Login</h2>
          <form name="login-form" method="post" action="login" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input ref={(input) => { this.username = input; }} className="form-control" type="text" name="username" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input ref={(input) => { this.password = input; }} className="form-control" type="password" name="password" id="password" />
            </div>
            {button}
          </form>
          {error}
          {this.props.children}
        </div>
        <div className="col-sm-12 text-center spaced">
          <p>Don&apos;t have an account? Contact <a href="mailto:workstation-support@janelia.hhmi.org?subject=[JW] Workstation Access Request&body=I'd like to request access to [describe the data set you are requesting] data in the Janelia Workstation.">Scientific Computing</a> and we will create one for you.</p>
        </div>
      </div>
    );
  }
}

LoginView.propTypes = {
  actions: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  children: PropTypes.node,
};

LoginView.defaultProps = {
  children: null,
};
