import Immutable from 'immutable';

const initialState = Immutable.Map({
  loading: 0,
  report: 0,
});

export default function quotaReducer(state = initialState, action) {
  switch (action.type) {
    case 'QUOTA_REPORT_LOADING':
      return state.set('loading', 1);
    case 'QUOTA_REPORT_LOADED':
      return state.set('loading', 0).set('report', action.json);
    case 'QUOTA_REPORT_ERROR':
      return state.set('loading', 0);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

