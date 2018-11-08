import { connect } from 'react-redux';
import { loginValidate, loginErrorClear } from '../actions/login';
import Login from '../components/Login';

const mapStateToProps = state => ({
  state: state.login,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loginValidate: (username, password) => {
      dispatch(loginValidate(username, password));
    },
    loginErrorClear: () => {
      dispatch(loginErrorClear());
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
