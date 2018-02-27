import fetch from 'isomorphic-fetch';
import settings from '../settings.json';

export const SERVICE_DATA_LOADING = 'SERVICE_DATA_LOADING';
export const SERVICE_DATA_LOADED = 'SERVICE_DATA_LOADED';
export const SERVICE_ITEM_DATA_LOADED = 'SERVICE_ITEM_DATA_LOADED';
export const SERVICE_DATA_LOAD_ERROR = 'SERVICE_DATA_LOAD_ERROR';

export function loadingServiceData(args) {
  return {
    type: SERVICE_DATA_LOADING,
    args,
  };
}

export function loadServiceError(error) {
  return {
    type: SERVICE_DATA_LOAD_ERROR,
    error,
  };
}

export function loadedServiceData(json) {
  return {
    type: SERVICE_DATA_LOADED,
    json,
  };
}

export function loadedSingleServiceData(json, name) {
  return {
    type: SERVICE_ITEM_DATA_LOADED,
    json,
    name,
  };
}

export function loadServiceData(args = {}) {
  return function loadServiceDataAsync(dispatch) {
    dispatch(loadingServiceData(args));

    let { serviceListUrl } = settings;
    if (Object.prototype.hasOwnProperty.call(args, 'name')) {
      serviceListUrl = `${serviceListUrl}/${args.name}`;
    }

    return fetch(serviceListUrl, {
      method: 'GET',
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
      if (Object.prototype.hasOwnProperty.call(args, 'name')) {
        dispatch(loadedSingleServiceData(json, args.name));
      } else if (Object.prototype.hasOwnProperty.call(args, 'filter')) {
        const filtered = json.filter(service => service.serviceName.match(args.filter));
        dispatch(loadedServiceData(filtered));
      } else {
        dispatch(loadedServiceData(json));
      }
    }).catch(error => dispatch(loadServiceError(error)));
  };
}
