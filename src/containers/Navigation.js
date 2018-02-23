import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';
import { logout } from '../actions/login';

const mapStateToProps = state => ({
  login: state.login,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: () => {
      dispatch(logout());
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation));
