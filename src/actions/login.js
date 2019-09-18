import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import settings from '../settings';
import history from '../history';

export const LOGIN_VAL_SUCCESS = 'LOGIN_VAL_SUCCESS';
export const LOGIN_RESTORE = 'LOGIN_RESTORE';
export const LOGOUT = 'LOGOUT';
export const LOGIN_VAL_REQUEST = 'LOGIN_VAL_REQUEST';
export const LOGIN_VAL_FAILURE = 'LOGIN_VAL_FAILURE';
export const LOGIN_USER_LOAD = 'LOGIN_USER_LOAD';
export const LOGIN_SET_REDIRECT_URL = 'LOGIN_SET_REDIRECT_URL';
export const LOGIN_CLEAR_REDIRECT_URL = 'LOGIN_CLEAR_REDIRECT_URL';
export const NOT_AUTHORIZED_FAILURE = 'NOT_AUTHORIZED_FAILURE';
export const LOGIN_ERROR_CLEAR = 'LOGIN_ERROR_CLEAR';

export function setRedirectUrl(url) {
  return {
    type: LOGIN_SET_REDIRECT_URL,
    url,
  };
}

export function clearRedirectUrl() {
  return {
    type: LOGIN_CLEAR_REDIRECT_URL,
  };
}

function loginValidationRequested(username) {
  return {
    type: LOGIN_VAL_REQUEST,
    username,
  };
}

function loginValidationError(error) {
  return {
    type: LOGIN_VAL_FAILURE,
    error,
  };
}

function loginValidationComplete(json, jwt) {
  return {
    type: LOGIN_VAL_SUCCESS,
    json,
    jwt,
  };
}

function loginUserLoadComplete(json) {
  return {
    type: LOGIN_USER_LOAD,
    json,
  };
}

function loadUserData(username, jwt, callback) {
  const url = `${settings.userDataUrl}?subjectKey=user%3A${username}`;
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    method: 'GET',
  }).then((res) => {
    if (res.status >= 400) {
      throw new Error('server error');
    }
    if (res.status === 204) {
      throw new Error('no workstation account');
    }
    return res.json();
  }).then((json) => {
    callback(json);
  }).catch(error => callback(error));
}

// validate the user and get a JWT for use with other API endpoints.
export function loginValidate(username, password) {
  return function loginValidateJWTAsync(dispatch) {
    dispatch(loginValidationRequested(username));
    const form = { username, password };
    const serialized = JSON.stringify(form);
    const apiUrl = settings.authApiUrl;
    return fetch(apiUrl, {
      method: 'POST',
      body: serialized,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 4000,
    }).then((res) => {
      if (res.status === 401) {
        throw new Error('bad login');
      } else if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.json();
    }).then((json) => {
      // Now decode the token and load in the user data.
      const decoded = jwtDecode(json.token);
      loadUserData(decoded.user_name, json.token, (userData) => {
        if (userData instanceof Error) {
          dispatch(loginValidationError(userData));
        } else {
          // set a cookie for later use, if the page gets a hard reset.
          const cookies = new Cookies();
          cookies.set('userId', json.token, { path: '/' });

          dispatch(loginUserLoadComplete(userData));
          dispatch(loginValidationComplete(decoded, json.token));
        }
      });
    }).catch(error => dispatch(loginValidationError(error)));
  };
}

function loginRestored(token) {
  return {
    type: LOGIN_RESTORE,
    token,
  };
}

export function loginRestore(jwt) {
  const username = jwtDecode(jwt).user_name;
  return function loginRestoreAsync(dispatch) {
    const url = `${settings.userDataUrl}?subjectKey=user%3A${username}`;
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.json();
    }).then((json) => {
      dispatch(loginUserLoadComplete(json));
      dispatch(loginRestored(jwt));
    }).catch(error => dispatch(loginValidationError(error)));
  };
}

export function loginErrorClear() {
  return {
    type: LOGIN_ERROR_CLEAR,
  };
}

export function notAuthorized() {
  return {
    type: NOT_AUTHORIZED_FAILURE,
  };
}

export function logout() {
  const cookies = new Cookies();
  cookies.remove('userId');
  history.push('/login');
  return {
    type: LOGOUT,
  };
}
