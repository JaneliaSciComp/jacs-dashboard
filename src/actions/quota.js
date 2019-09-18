import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import settings from '../settings';
import { logout, notAuthorized } from './login';

export const QUOTA_REPORT_LOADING = 'QUOTA_REPORT_LOADING';
export const QUOTA_REPORT_LOADED = 'QUOTA_REPORT_LOADED';
export const QUOTA_REPORT_ERROR = 'QUOTA_REPORT_ERROR';

export const STORAGE_QUOTAS_LOADING = 'STORAGE_QUOTAS_LOADING';
export const STORAGE_QUOTAS_LOADED = 'STORAGE_QUOTAS_LOADED';
export const STORAGE_QUOTAS_ERROR = 'STORAGE_QUOTAS_ERROR';

function loadingQuotaReport(username) {
  return {
    type: QUOTA_REPORT_LOADING,
    username,
  };
}

function loadedQuotaReport(json) {
  return {
    type: QUOTA_REPORT_LOADED,
    json,
  };
}

function loadQuotaReportError(error) {
  return {
    type: QUOTA_REPORT_ERROR,
    error,
  };
}

export function quotaReport(username) {
  const { quotaBaseUrl } = settings;
  const quotaUrl = `${quotaBaseUrl}?subjectName=${username}`;
  const cookies = new Cookies();
  const jwt = cookies.get('userId');

  return function quotaReportAsync(dispatch) {
    dispatch(loadingQuotaReport(username));
    return fetch(quotaUrl, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': settings.appId,
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
        dispatch(loadedQuotaReport(json));
      })
      .catch((error) => {
        if (error.message === 'Not Authorized') {
          dispatch(notAuthorized(error));
        } else {
          dispatch(loadQuotaReportError(error));
        }
      });
  };
}

function loadingStorageQuotas(username) {
  return {
    type: STORAGE_QUOTAS_LOADING,
    username,
  };
}

function loadedStorageQuotas(json) {
  return {
    type: STORAGE_QUOTAS_LOADED,
    json,
  };
}

function loadStorageQuotaError(error) {
  return {
    type: STORAGE_QUOTAS_ERROR,
    error,
  };
}

export function loadStorageQuotas() {
  const { quotaBaseUrl} = settings;
  const quotaUrl = `${quotaBaseUrl}`;
  const cookies = new Cookies();
  const jwt = cookies.get('userId');

  return function loadStorageQuotasAsync(dispatch) {
    dispatch(loadingStorageQuotas());
    return fetch(quotaUrl, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Application-Id': settings.appId,
        Accept: 'application/json',
      },
      timeout: 5000,
    }).then(res => res.json())
      .then((json) => {
        dispatch(loadedStorageQuotas(json));
      })
      .catch(error => dispatch(loadStorageQuotaError(error)));
  };
}
