import Immutable from 'immutable';

const initialState = Immutable.Map({
    error: '',
    start: '',
});

export default function appReducer(state = initialState, action) {
  return state;
}
