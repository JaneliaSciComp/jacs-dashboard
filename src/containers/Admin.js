import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { loadCapacity, updateCapacity } from '../actions/admin';

const mapStateToProps = state => ({
  cacapity: state.capacity,
  login: state.login,
  admin: state.admin,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadCapacity: (username) => {
      dispatch(loadCapacity(username));
    },
    updateCapacity: (newValues) => {
      dispatch(updateCapacity(newValues));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin));
