import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Service from '../components/Service';
import { loadServiceData } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  services: state.services,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadServiceData: (filter, order) => {
      dispatch(loadServiceData(filter, order));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Service));
