import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Job from '../components/Job';
import { loadJobData } from '../actions/services';
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
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Job));
