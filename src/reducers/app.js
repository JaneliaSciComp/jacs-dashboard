import Immutable from 'immutable';

const initialState = Immutable.Map({
  messages: null,
  error: '',
  start: '',
  shortDate: true,
  apiVersion: '',
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SETTINGS_TIME_FORMAT':
      return state.set('shortDate', action.state);
    case 'DELETED_SERVICE':
      return state.set('messages', action.message);
    case 'GET_VERSION_SUCCESS':
      return state.set('apiVersion', action.apiVersion);
    case 'GET_VERSION_ERROR':
      return state.set('messages', action.message);
    default:
      return state;
  }
}
