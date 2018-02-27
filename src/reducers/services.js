import Immutable from 'immutable';

const initialState = Immutable.Map({
  data: null,
  loading: 0,
  loaded: 0,
  error: null,
});

export default function servicesReducer(state = initialState, action) {
  switch (action.type) {
    case 'SERVICE_DATA_LOADING':
      return state.set('loading', 1).set('loaded', 0);
    case 'SERVICE_DATA_LOAD_ERROR':
      return state.set('loading', 0)
        .set('error', action.error);
    case 'SERVICE_DATA_LOADED':
      return state.set('data', action.json).set('loaded', 1);
    case 'SERVICE_ITEM_DATA_LOADED':
      return state.set(action.name, action.json).set('loaded', 1);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

