import Immutable from 'immutable';

const initialState = Immutable.Map({
  serviceName: null,
  args: Immutable.Map({}),
  meta: Immutable.Map({
  }),
  cron: Immutable.Map({
    enabled: false,
    minutes: '*',
    hours: '*',
    days: '*',
    months: '*',
    weekday: '*',
  }),
});

export default function serviceFormReducer(state = initialState, action) {
  switch (action.type) {
    case 'SERVICE_FORM_LOAD_DEFAULTS': {
      const { params } = action;
      return initialState
        .set('args', Immutable.Map(params))
        .set('serviceName', action.name);
    }
    case 'SERVICE_FORM_UPDATE_ARGS':
      return state.setIn(['args', action.name], action.value);
    case 'SERVICE_FORM_UPDATE_META':
      return state.setIn(['meta', action.name], action.value);
    case 'SERVICE_FORM_UPDATE_CRON':
      return state.setIn(['cron', action.name], action.value);
    case 'SERVICE_FORM_SET_NAME':
      return state.set('serviceName', action.name);
    case 'LOGOUT':
    case 'SERVICE_FORM_RESET':
      return initialState;
    default:
      return state;
  }
}

