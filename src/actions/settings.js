export const SETTINGS_TIME_FORMAT = 'SETTINGS_TIME_FORMAT';

export function setShortDate(state) {
  return {
    type: SETTINGS_TIME_FORMAT,
    state,
  };
}
