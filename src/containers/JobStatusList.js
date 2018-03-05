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
    loadJobList: (userId, page) => {
      dispatch(loadJobList(userId, page));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobStatusList));
