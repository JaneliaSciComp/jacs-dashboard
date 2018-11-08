import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ScheduledJobs from '../components/ScheduledJobs';
import { loadScheduledList } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  scheduled: state.scheduled,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadScheduledList: (args) => {
      dispatch(loadScheduledList(args));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduledJobs));
