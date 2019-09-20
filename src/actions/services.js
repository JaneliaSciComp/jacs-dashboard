import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import queryString from 'query-string';

import getSettings from '../settings';
import history from '../history';

export const SERVICE_DATA_LOADING = 'SERVICE_DATA_LOADING';
export const SERVICE_DATA_LOADED = 'SERVICE_DATA_LOADED';
export const SERVICE_ITEM_DATA_LOADED = 'SERVICE_ITEM_DATA_LOADED';
export const SERVICE_DATA_LOAD_ERROR = 'SERVICE_DATA_LOAD_ERROR';

export const SERVICE_STARTING = 'SERVICE_STARTING';
export const SERVICE_STARTED = 'SERVICE_STARTED';
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

export const DELETE_SERVICE_ERROR = 'DELETE_SERVICE_ERROR';
export const DELETED_SERVICE = 'DELETED_SERVICE';
export const DELETING_SERVICE = 'DELETING_SERVICE';

export const TOGGLE_SERVICE_ERROR = 'TOGGLE_SERVICE_ERROR';
export const TOGGLED_SERVICE = 'TOGGLED_SERVICE';
export const TOGGLING_SERVICE = 'TOGGLING_SERVICE';

export const UPDATE_JOB_STATE = "UPDATE_JOB_STATE";
export const UPDATE_JOB_STATE_ERROR = "UPDATE_JOB_STATE_ERROR";
export const UPDATE_JOB_STATE_SUCCESS = "UPDATE_JOB_STATE_SUCCESS";

export const DOWNLOAD_URL_ERROR = "DOWNLOAD_URL_ERROR";

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

    let { serviceListUrl } = getSettings();
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

export function startedJob(id) {
  return {
    type: SERVICE_STARTED,
    id,
  };
}


function startServiceError(error) {
  return {
    type: SERVICE_START_ERROR,
    error,
  };
}

function constructCronBody(formArgs) {
  const body = {
    name: formArgs.get('cron').get('name', 'anonymous cron'),
    serviceName: formArgs.get('serviceName'),
    runServiceAs: formArgs.get('runServiceAs'),
    serviceArgs: [],
  };

  formArgs.get('meta').entrySeq().forEach(([k, v]) => {
    body[k] = v;
  });

  formArgs.get('args').entrySeq().forEach(([k, v]) => {
    // put a '-' at the beginning of the argument names.
    body.serviceArgs.push(`-${k}`);
    body.serviceArgs.push(v);
  });

  // Convert cron input into a cron string:
  const cronString = formArgs.getIn(['cron', 'cronString']);
  body.cronScheduleDescriptor = cronString;

  return body;
}


function constructBodyFromForm(formArgs) {
  // TODO: unpack the form data and convert it into a json structure that can
  // be submitted to the api.

  // need different data structures if cron enabled.
  if (formArgs.getIn(['cron', 'enabled'])) {
    return constructCronBody(formArgs);
  }

  // cron not enabled, so lets return the default data structure.
  const body = {
    name: formArgs.get('serviceName'),
    args: [],
  };

  // convert command args to an array for POSTING
  formArgs.get('args').entrySeq().forEach(([k, v]) => {
    // put a '-' at the beginning of the argument names.
    body.args.push(`-${k}`);
    body.args.push(v);
  });

  // convert meta args to top level input.
  formArgs.get('meta').entrySeq().forEach(([k, v]) => {
    body[k] = v;
  });
  return body;
}

export function startService(args) {
  return function startServiceAsync(dispatch) {
    const serviceName = args.get('serviceName');

    dispatch(startingJob(serviceName));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { asyncServicesUrl, scheduledServicesUrl } = getSettings();

    let requestUrl;

    if (args.getIn(['cron', 'enabled'])) {
      requestUrl = scheduledServicesUrl;
    } else {
      requestUrl = `${asyncServicesUrl}/${serviceName}`;
    }

    const body = constructBodyFromForm(args);
    // TODO: validation on the client side?

    return fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000,
    }).then((res) => {
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      if (res.status === 401) {
        throw new Error('bad login');
      } else if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.json();
    }).then((json) => {
      dispatch(startedJob(json.serviceId));
      let serviceUrl = `/job/${json.serviceId}`;
      // dopey if block to handle the response from creating scheduled services
      // as they don't contain a serviceId attribute.
      if (Object.prototype.hasOwnProperty.call(json, 'cronScheduleDescriptor')) {
        serviceUrl = `/service/scheduled/${json.id}`;
      }
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

    const { jobDataUrl } = getSettings();
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


export function loadJobList(userId, page, sortBy = 'creationDate desc') {
  return function loadJobDataAsync(dispatch) {
    dispatch(loadingJobList());

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { jobListUrl } = getSettings();
    const qString = queryString.stringify({
      'service-owner': userId,
      page,
      'sort-by': sortBy,
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

    const { scheduledServicesUrl } = getSettings();
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

    const { scheduledServiceUrl } = getSettings();
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

function togglingScheduled(id) {
  return {
    type: TOGGLING_SERVICE,
    id,
  };
}

function toggleScheduledError(error) {
  return {
    type: TOGGLE_SERVICE_ERROR,
    error,
  };
}

function toggledScheduled(id, json) {
  return {
    type: TOGGLED_SERVICE,
    id,
    json,
  };
}

export function toggleScheduled(id, body) {
  return function toggleScheduledAsync(dispatch) {
    dispatch(togglingScheduled(id));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    // change the disabled parameter here
    const toggled = body.set('disabled', !body.get('disabled'));

    const { scheduledServiceUrl } = getSettings();
    const requestUrl = scheduledServiceUrl.replace('<id>', id);
    return fetch(requestUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000,
      body: JSON.stringify(toggled.toJS()),
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
      dispatch(toggledScheduled(id, json));
    }).catch((error) => {
      dispatch(toggleScheduledError(error));
    });
  };
}


function deletingScheduled(id) {
  return {
    type: DELETING_SERVICE,
    id,
  };
}

function deleteScheduledError(error, id) {
  return {
    type: DELETE_SERVICE_ERROR,
    error,
    id,
  };
}

function deletedScheduled(id, json) {
  return {
    type: DELETED_SERVICE,
    id,
    json,
    message: `Deleted scheduled service ${id}`,
  };
}


export function deleteScheduled(id) {
  return function deleteScheduledAsync(dispatch) {
    dispatch(deletingScheduled(id));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { scheduledServiceUrl } = getSettings();
    const requestUrl = scheduledServiceUrl.replace('<id>', id);
    return fetch(requestUrl, {
      method: 'DELETE',
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
      } else if (res.status === 204) {
        return { deleted: true };
      }
      return res.json();
    }).then((json) => {
      // TODO: need to check our response.
      // if bad, then need to show an error message explaining what happened
      dispatch(deletedScheduled(id, json));
      history.push('/services/scheduled');
    }).catch((error) => {
      dispatch(deleteScheduledError(error, id));
    });
  };
}

export function updateJobState(jobId, jobState) {
  return (dispatch) => {
    dispatch(updatingJobState(jobId, jobState));

    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    const { jobActionsUrl } = getSettings();

    const requestUrl = `${jobActionsUrl}/${jobId}/state/${jobState}`;

    return fetch(requestUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000
    }).then((res) => {
      if (res.status === 401) {
        throw new Error("bad login");
      }
      return res.json();
    }).then((json) => {
      dispatch(updateJobStateSuccess(json));
    }).catch(error => dispatch(updateJobStateError(error)))
  };
}

function updatingJobState(jobId, jobState) {
  return {
    type: UPDATE_JOB_STATE,
    jobId: jobId,
    jobState: jobState
  };
}

function updateJobStateError(error) {
  return {
    type: UPDATE_JOB_STATE_ERROR,
    error
  };
}

function updateJobStateSuccess(json) {
  return {
    type: UPDATE_JOB_STATE_SUCCESS,
    json
  };
}

export function downloadURL(url, filename) {
  return function downloadURLAsync(dispatch) {
    const cookies = new Cookies();
    const jwt = cookies.get('userId');

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000
    }).then((res) => {
      if (res.status === 401) {
        throw new Error('bad login');
      } else if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.blob();
    }).then((res) => {
      let anchor = document.createElement("a");
      let file = new Blob([res], { type: 'application/octet-stream' });
      anchor.href = URL.createObjectURL(file);
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }).catch(error => dispatch(downloadURLError(error)));
  };
}

function downloadURLError(error) {
  return {
    type: DOWNLOAD_URL_ERROR,
    error
  };
}
