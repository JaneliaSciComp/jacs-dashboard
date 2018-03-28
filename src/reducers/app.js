import Immutable from 'immutable';

const initialState = Immutable.Map({
  messages: null,
  error: '',
  start: '',
  shortDate: true,
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SETTINGS_TIME_FORMAT':
      return state.set('shortDate', action.state);
    case 'DELETED_SERVICE':
      return state.set('messages', action.message);
    default:
      return state;
  }
}
