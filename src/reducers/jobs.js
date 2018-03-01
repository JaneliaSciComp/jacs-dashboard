import Immutable from 'immutable';

const initialState = Immutable.Map({
  data: null,
  loading: 0,
  loaded: 0,
  error: null,
});

export default function jobsReducer(state = initialState, action) {
  switch (action.type) {
    case 'JOB_DATA_LOADING':
      return state.set('loading', 1).set('loaded', 0);
    case 'JOB_DATA_LOAD_ERROR':
      return state.set('loading', 0)
        .set('error', action.error);
    case 'JOB_DATA_LOADED':
      return state.set('data', action.json).set('loaded', 1);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

