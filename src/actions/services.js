import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import queryString from 'query-string';

import settings from '../settings.json';
import history from '../history';

export const SERVICE_DATA_LOADING = 'SERVICE_DATA_LOADING';
export const SERVICE_DATA_LOADED = 'SERVICE_DATA_LOADED';
export const SERVICE_ITEM_DATA_LOADED = 'SERVICE_ITEM_DATA_LOADED';
export const SERVICE_DATA_LOAD_ERROR = 'SERVICE_DATA_LOAD_ERROR';

export const SERVICE_STARTING = 'SERVICE_STARTING';
export const SERVICE_START_ERROR = 'SERVICE_START_ERROR';

export const JOB_DATA_LOADING = 'JOB_DATA_LOADING';
export const JOB_DATA_LOADED = 'JOB_DATA_LOADED';
export const JOB_DATA_LOAD_ERROR = 'JOB_DATA_LOAD_ERROR';

export const JOB_LIST_LOADING = 'JOB_LIST_LOADING';
export const JOB_LIST_LOADED = 'JOB_LIST_LOADED';
export const JOB_LIST_LOAD_ERROR = 'JOB_LIST_LOAD_ERROR';

export const SCHEDULED_LIST_LOADING = 'SCHEDULED_LIST_LOADING';
export const SCHEDULED_LIST_LOADED = 'SCHEDULED_LIST_LOADED';
export const SCHEDULED_LIST_LOAD_ERROR = 'SCHEDULED_LIST_LOAD_ERROR';

export const SCHEDULED_SERVICE_DATA_LOADING = 'SCHEDULED_SERVICE_DATA_LOADING';
export const SCHEDULED_SERVICE_DATA_LOADED = 'SCHEDULED_SERVICE_DATA_LOADED';
export const SCHEDULED_SERVICE_DATA_LOAD_ERROR = 'SCHEDULED_SERVICE_DATA_LOAD_ERROR';

export const PAUSE_SERVICE_ERROR = 'PAUSE_SERVICE_ERROR';
export const PAUSED_SERVICE = 'PAUSED_SERVICE';
export const PAUSING_SERVICE = 'PAUSING_SERVICE';

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

export function startingJob(name) {
  return {
    type: SERVICE_STARTING,
    name,
  };
}

function startServiceError(error) {
  return {
    type: SERVICE_START_ERROR,
    error,
  };
}

export function startService(name, args) {
  return function startServiceAsync(dispatch) {
    dispatch(startingJob(name));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { asyncServiceUrl } = settings;
    const requestUrl = asyncServiceUrl.replace('<service_name>', name);
    return fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(args),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      const serviceUrl = `/job/${json.serviceId}`;
      history.push(serviceUrl);
    }).catch(error => dispatch(startServiceError(error)));
  };
}

function loadingJobData(id) {
  return {
    type: JOB_DATA_LOADING,
    id,
  };
}

function loadJobDataError(error) {
  return {
    type: JOB_DATA_LOAD_ERROR,
    error,
  };
}

function loadedJobData(json) {
  return {
    type: JOB_DATA_LOADED,
    json,
  };
}


export function loadJobData(jobId) {
  return function loadJobDataAsync(dispatch) {
    dispatch(loadingJobData(jobId));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { jobDataUrl } = settings;
    const requestUrl = jobDataUrl.replace('<job_id>', jobId);
    return fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(loadedJobData(json));
    }).catch(error => dispatch(loadJobDataError(error)));
  };
}

function loadingJobList(id) {
  return {
    type: JOB_LIST_LOADING,
    id,
  };
}

function loadJobListError(error) {
  return {
    type: JOB_LIST_LOAD_ERROR,
    error,
  };
}

function loadedJobList(json) {
  return {
    type: JOB_LIST_LOADED,
    json,
  };
}


export function loadJobList(userId, page) {
  return function loadJobDataAsync(dispatch) {
    dispatch(loadingJobList());

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { jobListUrl } = settings;
    const qString = queryString.stringify({
      'service-owner': userId,
      page,
    });
    const requestUrl = `${jobListUrl}?${qString}`;
    return fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(loadedJobList(json));
    }).catch(error => dispatch(loadJobListError(error)));
  };
}

function loadingScheduledList(id) {
  return {
    type: SCHEDULED_LIST_LOADING,
    id,
  };
}

function loadScheduledListError(error) {
  return {
    type: SCHEDULED_LIST_LOAD_ERROR,
    error,
  };
}

function loadedScheduledList(json) {
  return {
    type: SCHEDULED_LIST_LOADED,
    json,
  };
}


export function loadScheduledList() {
  return function loadJobDataAsync(dispatch) {
    dispatch(loadingScheduledList());

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { scheduledServicesUrl } = settings;
    return fetch(scheduledServicesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(loadedScheduledList(json));
    }).catch(error => dispatch(loadScheduledListError(error)));
  };
}


function loadingScheduledServiceData(id) {
  return {
    type: SCHEDULED_SERVICE_DATA_LOADING,
    id,
  };
}

function loadScheduledServiceDataError(error) {
  return {
    type: SCHEDULED_SERVICE_DATA_LOAD_ERROR,
    error,
  };
}

function loadedScheduledServiceData(id, json) {
  return {
    type: SCHEDULED_SERVICE_DATA_LOADED,
    id,
    json,
  };
}


export function loadScheduledServiceData(id) {
  return function loadScheduledServiceDataAsync(dispatch) {
    dispatch(loadingScheduledServiceData(id));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { scheduledServiceUrl } = settings;
    const requestUrl = scheduledServiceUrl.replace('<id>', id);
    return fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(loadedScheduledServiceData(id, json));
    }).catch(error => dispatch(loadScheduledServiceDataError(error)));
  };
}

function pausingScheduled(id) {
  return {
    type: PAUSING_SERVICE,
    id,
  };
}

function pauseScheduledError(error) {
  return {
    type: PAUSE_SERVICE_ERROR,
    error,
  };
}

function pausedScheduled(id, json) {
  return {
    type: PAUSED_SERVICE,
    id,
    json,
  };
}


export function pauseScheduled(id, body) {
  return function pauseScheduledAsync(dispatch) {
    dispatch(pausingScheduled(id));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    // change the disabled parameter here
    body.disabled = true;

    const { scheduledServiceUrl } = settings;
    const requestUrl = scheduledServiceUrl.replace('<id>', id);
    return fetch(requestUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000,
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.status === 401) {
        throw new Error('bad login');
      } else if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.json();
    }).then((json) => {
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(pausedScheduled(id, json));
    }).catch(error => dispatch(pauseScheduledError(error)));
  };
}
