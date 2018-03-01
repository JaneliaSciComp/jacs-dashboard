import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Job from '../components/Job';
import { loadJobData } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  job: state.jobs,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobData: (jobId) => {
      dispatch(loadJobData(jobId));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Job));
