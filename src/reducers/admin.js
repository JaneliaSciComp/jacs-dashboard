import Immutable from 'immutable';

const initialState = Immutable.Map({
  capacity: {},
  cap_loading: false,
  cap_loaded: false,
  error: null,
});

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_CAPACITY_STATS':
      return state.set('cap_loading', true);
    case 'LOADED_CAPACITY_STATS':
      return state.set('capacity', action.json).set('cap_loading', false).set('cap_loaded', true);
    case 'LOAD_CAPACITY_STATS_ERROR':
    case 'PROCESSING_COUNT_UPDATE_ERROR':
    case 'WAITING_COUNT_UPDATE_ERROR':
      return state.set('error', action.error);
    default:
      return state;
  }
}
