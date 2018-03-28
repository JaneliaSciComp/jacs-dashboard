import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import settings from '../settings.json';
import { logout, notAuthorized } from './login';

export const LOADING_CAPACITY_STATS = 'LOADING_CAPACITY_STATS';
export const LOADED_CAPACITY_STATS = 'LOADED_CAPACITY_STATS';
export const LOAD_CAPACITY_STATS_ERROR = 'LOAD_CAPACITY_STATS_ERROR';

function loadingStats(username) {
  return {
    type: LOADING_CAPACITY_STATS,
    username,
  };
}

function loadedStats(json) {
  return {
    type: LOADED_CAPACITY_STATS,
    json,
  };
}

function loadStatsError(error) {
  return {
    type: LOAD_CAPACITY_STATS_ERROR,
    error,
  };
}

export function loadStats(username) {
  const { capacityStatsUrl } = settings;
  const cookies = new Cookies();
  const jwt = cookies.get('userId');

  return function quotaReportAsync(dispatch) {
    dispatch(loadingStats(username));
    return fetch(capacityStatsUrl, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': 'webstation',
        Accept: 'application/json',
      },
      timeout: 5000,
    }).then((res) => {
      if (res.status === 401) {
        // log the user out and then redirect to the login page.
        dispatch(logout());
        throw Error('Not Authorized');
      }
      return res.json();
    })
      .then((json) => {
        dispatch(loadedStats(json));
      })
      .catch((error) => {
        if (error.message === 'Not Authorized') {
          dispatch(notAuthorized(error));
        } else {
          dispatch(loadStatsError(error));
        }
      });
  };
}
