import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';

const mapStateToProps = state => ({
  login: state.login,
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation));
