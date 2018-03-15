import Immutable from 'immutable';

const initialState = Immutable.Map({
  data: null,
  loading: 0,
  loaded: 0,
  error: null,
});

export default function scheduledReducer(state = initialState, action) {
  switch (action.type) {
    case 'SCHEDULED_LIST_LOADING':
      return state.set('loading', 1).set('loaded', 0);
    case 'SCHEDULED_LIST_LOAD_ERROR':
      return state.set('loading', 0)
        .set('error', action.error);
    case 'SCHEDULED_LIST_LOADED':
      return state.set('data', action.json).set('loaded', 1);
    case 'SCHEDULED_SERVICE_DATA_LOADING':
      return state.set('loading', 1).set('loaded', 0);
    case 'SCHEDULED_SERVICE_DATA_LOADED':
      return state.set('loaded', 1).set('loading', 0).set(action.id, action.json);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

