import Immutable from 'immutable';

const initialState = Immutable.Map({
  list: [],
  list_loading: 0,
  list_loaded: 0,
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

    case 'JOB_LIST_LOADING':
      return state.set('list_loading', 1).set('list_loaded', 0);
    case 'JOB_LIST_LOAD_ERROR':
      return state.set('list_loading', 0)
        .set('error', action.error);
    case 'JOB_LIST_LOADED':
      return state.set('list', action.json).set('list_loaded', 1);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

