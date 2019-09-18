const APP_SETTINGS = {
  "appId": "v2-dashboard",
  "userDataUrl": process.env.REACT_APP_JACS_SYNC_URL + "/data/user/subject",
  "capacityStatsUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/async-services/stats",
  "authApiUrl": process.env.REACT_APP_AUTH_URL,
  "serviceListUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/services/metadata",
  "asyncServicesUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/async-services",
  "scheduledServicesUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/scheduled-services",
  "scheduledServiceUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/scheduled-services/<id>",
  "jobDataUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/services/<job_id>",
  "jobListUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/services",
  "jobActionsUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/services",
  "quotaBaseUrl": process.env.REACT_APP_STORAGE_URL + "/storage/quota/nrsFilestore/report",
  "avatarUrl": process.env.REACT_APP_AVATAR_URL + "?name=<username>&width=100&height=100",
  "processingSlotsUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/async-services/processing-slots-count/<newCount>",
  "waitingSlotsUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/async-services/waiting-slots-count/<newCount>",
  "apiVersionUrl": process.env.REACT_APP_JACS_ASYNC_URL + "/version"
};

export default APP_SETTINGS;
