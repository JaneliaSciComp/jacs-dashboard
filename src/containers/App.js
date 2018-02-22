import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
