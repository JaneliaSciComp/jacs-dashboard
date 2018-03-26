import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ScheduledJobDetails from '../components/ScheduledJobDetails';
import { loadScheduledServiceData, toggleScheduled, deleteScheduled } from '../actions/services';

const mapStateToProps = state => ({
  login: state.login,
  shortDate: state.app.get('shortDate'),
  scheduled: state.scheduled,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadScheduledServiceData: (id) => {
      dispatch(loadScheduledServiceData(id));
    },
    toggleScheduled: (id, body) => {
      dispatch(toggleScheduled(id, body));
    },
    deleteScheduled: (id) => {
      dispatch(deleteScheduled(id));
    },
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduledJobDetails));
