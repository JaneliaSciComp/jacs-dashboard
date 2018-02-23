import Immutable from 'immutable';

const initialState = Immutable.Map({
  username: null,
  loading: 0,
  loggedIn: 0,
  error: null,
  user: null,
  redirectUrl: null,
  token: null,
});

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_VAL_SUCCESS':
      return state.set('loading', 0)
        .set('username', action.json.user_name)
        .set('loggedIn', 1)
        .set('token', action.jwt)
        .set('error', action.json.error);
    case 'LOGIN_VAL_REQUEST':
      return state.set('loading', 1);
    case 'LOGIN_VAL_FAILURE':
      return state.set('loading', 0)
        .set('error', action.error);
    case 'LOGIN_USER_LOAD':
      return state.set('user', action.json).set('username', action.json.name);
    case 'LOGIN_RESTORE':
      return state.set('token', action.token).set('loggedIn', 1);
    case 'LOGIN_SET_REDIRECT_URL':
      return state.set('redirectUrl', action.url);
    case 'LOGIN_CLEAR_REDIRECT_URL':
      return state.set('redirectUrl', null);
    case 'LOGIN_ERROR_CLEAR':
      return state.set('error', null);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

