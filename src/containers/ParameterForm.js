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
    setFlagParams: (name, flag, value) => {
      dispatch(setFlagParams(name, flag, value));
    },
    setParams: (name, flag, value) => {
      dispatch(setParams(name, flag, value));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParameterForm));
