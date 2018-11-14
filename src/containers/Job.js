import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Job from '../components/Job';
import { downloadURL, loadJobData, updateJobState } from '../actions/services';
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
    },
    retryJob: (jobId) => {
      dispatch(updateJobState(jobId, 'RETRY'));
    },
    download: (url, filename) => {
      dispatch(downloadURL(url, filename));
    }
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Job));
