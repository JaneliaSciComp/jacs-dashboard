import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ServiceStart from '../components/ServiceStart';
import { loadServiceData, startService } from '../actions/services';
import { toggleScheduled, resetServiceForm, setServiceName, setMeta, setCron } from '../actions/serviceForm';

const mapStateToProps = state => ({
  login: state.login,
  services: state.services,
  serviceForm: state.serviceForm,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadServiceData: (filter, order) => {
      dispatch(loadServiceData(filter, order));
    },
    startService: (args) => {
      dispatch(startService(args));
    },
    toggleScheduled: (status) => {
      dispatch(toggleScheduled(status));
    },
    resetServiceForm: () => {
      dispatch(resetServiceForm());
    },
    setServiceName: (name) => {
      dispatch(setServiceName(name));
    },
    setMeta: (name, value) => {
      dispatch(setMeta(name, value));
    },
    setCron: (name, value) => {
      dispatch(setCron(name, value));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceStart));
