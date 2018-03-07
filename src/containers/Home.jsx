import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { loadJobList } from '../actions/services';
import { quotaReport } from '../actions/quota';

const mapStateToProps = state => ({
  login: state.login,
  jobs: state.jobs,
  quota: state.quota,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobList: (userId, page) => {
      dispatch(loadJobList(userId, page));
    },
    quotaReport: (username) => {
      dispatch(quotaReport(username));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home));
