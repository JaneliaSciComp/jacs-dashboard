export const SETTINGS_TIME_FORMAT = 'SETTINGS_TIME_FORMAT';
export const GET_CONF_SUCCESS = 'GET_CONF_SUCCESS';
export const GET_CONF_ERROR = 'GET_CONF_ERROR';

export function setShortDate(state) {
  return {
    type: SETTINGS_TIME_FORMAT,
    state,
  };
}

export function getConf() {
  return function getEnvSettingsAsync(dispatch) {
    const confPath = "/conf.json"
    return fetch(confPath, {
      method: 'GET',
    }).then(res => {
      return res.json();
    }).then(conf => {
      dispatch(getConfSuccessful(conf));
    }).catch(error => dispatch(getConfError(error)));
  };
}

function getConfSuccessful(conf) {
  return {
    type: GET_CONF_SUCCESS,
    conf: conf
  }
}

function getConfError(error) {
  return {
    type: GET_CONF_ERROR,
    error,
  };
}
