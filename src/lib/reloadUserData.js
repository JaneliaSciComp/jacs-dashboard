// this will check if there is a user cookie and restore the user login on
// reloads from the server.
// TODO: !!!! This is really insecure as the cookie could easily be set by anyone
// without authentication. Must fix!!!
import Promise from 'yaku';

import { loginRestore } from '../actions/login';
import { getConf } from "../actions/settings";

export default function reloadUserData(dispatch, jwt) {
  if (jwt) {
    return dispatch(getConf()).then(
        response => dispatch(loginRestore(jwt))
    )
  }
  return Promise.resolve();
}
