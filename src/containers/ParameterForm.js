import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ParameterForm from '../components/ParameterForm';
import { setParams, setFlagParams } from '../actions/serviceForm';

const mapStateToProps = state => ({
  login: state.login,
  services: state.services,
  args: state.serviceForm.get('args'),
});

const mapDispatchToProps = dispatch => ({
  actions: {
    setFlagParams: (name, value) => {
      dispatch(setFlagParams(name, value));
    },
    setParams: (name, value) => {
      dispatch(setParams(name, value));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParameterForm));
