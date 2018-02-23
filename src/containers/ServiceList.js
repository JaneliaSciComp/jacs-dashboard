import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ServiceList from '../components/ServiceList';

const mapStateToProps = state => ({
  login: state.login,
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceList));
