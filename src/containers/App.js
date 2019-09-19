import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../components/App';
import { getConf } from "../actions/settings";

const mapStateToProps = state => ({
    conf: state.app.get('conf')
});

const mapDispatchToProps = dispatch => ({
    actions: {
        getConf: () => {
            dispatch(getConf());
        }
    },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
