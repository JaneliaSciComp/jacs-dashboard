import Immutable from 'immutable';

const initialState = Immutable.Map({
  error: '',
  start: '',
  shortDate: true,
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SETTINGS_TIME_FORMAT':
      return state.set('shortDate', action.state);
    default:
      return state;
  }
}
