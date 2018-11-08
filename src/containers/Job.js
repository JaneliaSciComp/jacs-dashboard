import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Job from '../components/Job';
import { loadJobData, updateJobState } from '../actions/services';
import { setShortDate } from '../actions/settings';

const mapStateToProps = state => ({
  login: state.login,
  job: state.jobs,
  shortDate: state.app.get('shortDate'),
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadJobData: (jobId) => {
      dispatch(loadJobData(jobId));
    },
    setShortDate: (format) => {
      dispatch(setShortDate(format));
    },
    pauseJob: (jobId) => {
      dispatch(updateJobState(jobId, 'SUSPENDED'));
    },
    resumeJob: (jobId) => {
      dispatch(updateJobState(jobId, 'RESUMED'));
    },
    cancelJob: (jobId) => {
      dispatch(updateJobState(jobId, 'CANCELED'));
    }
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Job));
