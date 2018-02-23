import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Profile from '../components/Profile';

const mapStateToProps = state => ({
  login: state.login,
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile));
