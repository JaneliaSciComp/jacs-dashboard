let appSettings = initAppSettings({});

export function updateAppSettings(conf) {
  appSettings = initAppSettings(conf);
}

function initAppSettings(conf) {
  return {
    "appId": "v2-dashboard",
    "userDataUrl": getConfProperty(conf, 'REACT_APP_JACS_SYNC_URL') + "/data/user/subject",
    "capacityStatsUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/async-services/stats",
    "authApiUrl": getConfProperty(conf, 'REACT_APP_AUTH_URL'),
    "serviceListUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/services/metadata",
    "asyncServicesUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/async-services",
    "scheduledServicesUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/scheduled-services",
    "scheduledServiceUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/scheduled-services/<id>",
    "jobDataUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/services/<job_id>",
    "jobListUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/services",
    "jobActionsUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/services",
    "quotaBaseUrl": getConfProperty(conf, 'REACT_APP_STORAGE_URL') + "/storage/quota/nrsFilestore/report",
    "avatarUrl": getConfProperty(conf, 'REACT_APP_AVATAR_URL') + "?name=<username>&width=100&height=100",
    "processingSlotsUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/async-services/processing-slots-count/<newCount>",
    "waitingSlotsUrl": getConfProperty(conf, 'REACT_APP_JACS_ASYNC_URL') + "/async-services/waiting-slots-count/<newCount>",
    "apiVersionUrl": getConfProperty(conf, 'REACT_APP_JACS_OPEN_ASYNC_URL') + "/version",
  };
}

function getConfProperty(conf, property) {
  return conf[property] || process.env[property];
}

export default function getSettings() {
  return appSettings;
}
