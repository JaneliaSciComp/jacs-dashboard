import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { loadCapacity } from '../actions/admin';

const mapStateToProps = state => ({
  cacapity: state.capacity,
  login: state.login,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadCapacity: (username) => {
      dispatch(loadCapacity(username));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin));
