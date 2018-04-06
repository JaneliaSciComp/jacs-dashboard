import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import SortableTableHeader from '../components/SortableTableHeader';

const mapStateToProps = state => ({
  login: state.login,
});

export default withRouter(connect(mapStateToProps)(SortableTableHeader));
