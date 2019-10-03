export const SERVICE_FORM_UPDATE_ARGS = 'SERVICE_FORM_UPDATE_ARGS';
export const SERVICE_FORM_UPDATE_FLAG_ARGS = 'SERVICE_FORM_UPDATE_FLAG_ARGS';
export const SERVICE_FORM_UPDATE_META = 'SERVICE_FORM_UPDATE_META';
export const SERVICE_FORM_UPDATE_CRON = 'SERVICE_FORM_UPDATE_CRON';
export const SERVICE_FORM_RESET = 'SERVICE_FORM_RESET';
export const SERVICE_FORM_SET_NAME = 'SERVICE_FORM_SET_NAME';

export function setFlagParams(name, flag, value) {
  return {
    type: SERVICE_FORM_UPDATE_FLAG_ARGS,
    name,
    flag,
    value,
  };
}

export function setParams(name, flag, value) {
  return {
    type: SERVICE_FORM_UPDATE_ARGS,
    name,
    flag,
    value,
  };
}

export function setMeta(name, value) {
  return {
    type: SERVICE_FORM_UPDATE_META,
    name,
    value,
  };
}

export function setCron(name, value) {
  return {
    type: SERVICE_FORM_UPDATE_CRON,
    name,
    value,
  };
}

export function toggleScheduled(value) {
  return {
    type: SERVICE_FORM_UPDATE_CRON,
    name: 'enabled',
    value,
  };
}

export function resetServiceForm() {
  return {
    type: SERVICE_FORM_RESET,
  };
}

export function setServiceName(name) {
  return {
    type: SERVICE_FORM_SET_NAME,
    name,
  };
}
