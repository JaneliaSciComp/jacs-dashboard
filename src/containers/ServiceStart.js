import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ServiceStart from '../components/ServiceStart';
import { loadServiceData, startService } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  services: state.services,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadServiceData: (filter, order) => {
      dispatch(loadServiceData(filter, order));
    },
    startService: (serviceName, args) => {
      dispatch(startService(serviceName, args));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceStart));
