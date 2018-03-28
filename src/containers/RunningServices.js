import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RunningServices from '../components/RunningServices';
import { loadStats } from '../actions/stats';

const mapStateToProps = state => ({
  login: state.login,
  stats: state.stats,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadStats: (username) => {
      dispatch(loadStats(username));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(RunningServices));
