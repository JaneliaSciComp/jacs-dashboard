import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { loadJobList } from '../actions/services';
import { quotaReport } from '../actions/quota';
import { loadStats } from '../actions/stats';

const mapStateToProps = state => ({
  login: state.login,
  jobs: state.jobs,
  quota: state.quota,
  stats: state.stats,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobList: (userId, page) => {
      dispatch(loadJobList(userId, page));
    },
    quotaReport: (username) => {
      dispatch(quotaReport(username));
    },
    loadStats: (username) => {
      dispatch(loadStats(username));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home));
