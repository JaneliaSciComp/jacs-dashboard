import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RunningServices from '../components/RunningServices';
import { loadCapacity } from '../actions/admin';

const mapStateToProps = state => ({
  login: state.login,
  stats: state.admin,
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
)(RunningServices));