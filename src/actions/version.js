import settings from '../settings.json';

export const GET_VERSION_SUCCESS = 'GET_VERSION_SUCCESS';
export const GET_VERSION_ERROR = 'GET_VERSION_ERROR';

export function getVersion() {
  return function getVersionAsync(dispatch) {
    const { apiVersionUrl } = settings;
    return fetch(apiVersionUrl, {
      method: 'GET',
    }).then(res => {
      return res.text();
    }).then(versionText => {
      dispatch(getVersionSuccessful(versionText));
    }).catch(error => dispatch(getVersionError(error)));
  };
}

function getVersionSuccessful(version) {
  return {
    type: GET_VERSION_SUCCESS,
    apiVersion: version,
  };
}

function getVersionError(error) {
  return {
    type: GET_VERSION_ERROR,
    error,
  };
}
