import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { loadJobList } from '../actions/services';
import { quotaReport } from '../actions/quota';
import { loadCapacity } from '../actions/admin';
import { getVersion } from '../actions/version';

const mapStateToProps = state => ({
  login: state.login,
  jobs: state.jobs,
  quota: state.quota,
  stats: state.admin,
  apiVersion: state.app.get('apiVersion')
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobList: (userId, page) => {
      dispatch(loadJobList(userId, page));
    },
    quotaReport: (username) => {
      dispatch(quotaReport(username));
    },
    loadCapacity: (username) => {
      dispatch(loadCapacity(username));
    },
    getVersion: () => {
      dispatch(getVersion());
    }
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home));
