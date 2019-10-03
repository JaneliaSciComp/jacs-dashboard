import Immutable from 'immutable';

const initialState = Immutable.Map({
  serviceName: null,
  args: Immutable.Map({}),
  meta: Immutable.Map({
    processingLocation: 'LOCAL',
  }),
  cron: Immutable.Map({
    enabled: false,
    cronString: '*/10 * * * *',
  }),
  modified: false,
});

export default function serviceFormReducer(state = initialState, action) {
  switch (action.type) {
    case 'SERVICE_FORM_UPDATE_ARGS':
      return state.setIn(['args', action.name], {flag: action.flag, value: action.value})
        .set('modified', true);
    case 'SERVICE_FORM_UPDATE_FLAG_ARGS':
      if (action.value) {
        // add the flag arg with a value of null - which should not be output in the list of arguments
        return state.setIn(['args', action.name], {flag: action.flag, value: null})
            .set('modified', true);
      } else {
        // remove the flag arg
        return state.removeIn(['args', action.name])
            .set('modified', true);
      }
    case 'SERVICE_FORM_UPDATE_META':
      return state.setIn(['meta', action.name], action.value)
        .set('modified', true);
    case 'SERVICE_FORM_UPDATE_CRON':
      return state.setIn(['cron', action.name], action.value)
        .set('modified', true);
    case 'SERVICE_FORM_SET_NAME':
      return state.set('serviceName', action.name);
    case 'LOGOUT':
    case 'SERVICE_STARTED':
    case 'SERVICE_FORM_RESET':
      return initialState;
    default:
      return state;
  }
}

