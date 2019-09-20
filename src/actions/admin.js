import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import getSettings from '../settings';
import { logout, notAuthorized } from './login';

export const LOADING_CAPACITY_STATS = 'LOADING_CAPACITY_STATS';
export const LOADED_CAPACITY_STATS = 'LOADED_CAPACITY_STATS';
export const LOAD_CAPACITY_STATS_ERROR = 'LOAD_CAPACITY_STATS_ERROR';

function loadingCapacity(username) {
  return {
    type: LOADING_CAPACITY_STATS,
    username,
  };
}

function loadedCapacity(json) {
  return {
    type: LOADED_CAPACITY_STATS,
    json,
  };
}

function loadCapacityError(error) {
  return {
    type: LOAD_CAPACITY_STATS_ERROR,
    error,
  };
}

export function loadCapacity(username) {
  const { appId, capacityStatsUrl } = getSettings();
  const cookies = new Cookies();
  const jwt = cookies.get('userId');

  return function quotaReportAsync(dispatch) {
    dispatch(loadingCapacity(username));
    return fetch(capacityStatsUrl, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': appId,
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
        dispatch(loadedCapacity(json));
      })
      .catch((error) => {
        if (error.message === 'Not Authorized') {
          dispatch(notAuthorized(error));
        } else {
          dispatch(loadCapacityError(error));
        }
      });
  };
}

export function updateProcessingCapacity(slotCount) {
  const cookies = new Cookies();
  const jwt = cookies.get('userId');

  return (dispatch) => {
    const { appId, processingSlotsUrl } = getSettings();
    const updateProcessingUrl = processingSlotsUrl.replace('<newCount>', slotCount);
    dispatch({ type: 'PROCESSING_COUNT_UPDATING' });
    return fetch(updateProcessingUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': appId,
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
    }).then((json) => {
      dispatch({ type: 'PROCESSING_COUNT_UPDATED', json });
    }).catch((error) => {
      if (error.message === 'Not Authorized') {
        dispatch(notAuthorized(error));
      } else {
        dispatch({ type: 'PROCESSING_COUNT_UPDATE_ERROR', error });
      }
    });
  };
}

export function updateWaitingCapacity(slotCount) {
  const cookies = new Cookies();
  const jwt = cookies.get('userId');
  const { appId, waitingSlotsUrl } = getSettings();

  return (dispatch) => {
    const updateWaitingUrl = waitingSlotsUrl.replace('<newCount>', slotCount);
    dispatch({ type: 'WAITING_COUNT_UPDATING' });
    return fetch(updateWaitingUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': appId,
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
    }).then((json) => {
      dispatch({ type: 'WAITING_COUNT_UPDATED', json });
    }).catch((error) => {
      if (error.message === 'Not Authorized') {
        dispatch(notAuthorized(error));
      } else {
        dispatch({ type: 'WAITING_COUNT_UPDATE_ERROR', error, message: error.message });
      }
    });
  };
}

export function updateCapacity(newValues) {
  const { wait, available } = newValues;
  return (dispatch) => {
    return dispatch(updateWaitingCapacity(wait)).then(() => {
      return dispatch(updateProcessingCapacity(available));
    });
  };
}
