import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import JobStatusList from '../components/JobStatusList';
import { loadJobList } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  jobs: state.jobs,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobList: (userId, page, sortBy) => {
      dispatch(loadJobList(userId, page, sortBy));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobStatusList));
