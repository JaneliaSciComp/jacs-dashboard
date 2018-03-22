import Immutable from 'immutable';
import reducer from './service_form';

const initialState = Immutable.Map({
  serviceName: null,
  args: Immutable.Map({}),
  meta: Immutable.Map({
    processingLocation: 'LOCAL',
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


it('correctly sets initial settings', () => {
  expect(reducer(undefined, {})).toEqual(initialState);
});

it('correctly loads defaults', () => {
  const action = {
    type: 'SERVICE_FORM_LOAD_DEFAULTS',
    params: {
      seconds: 0,
    },
    name: 'sleepTest',
  };
  expect(reducer(undefined, action))
    .toEqual(initialState
      .set('args', Immutable.Map(action.params))
      .set('serviceName', action.name));
});

it('correctly enables cron', () => {
  expect(reducer(undefined, {
    type: 'SERVICE_FORM_UPDATE_CRON',
    name: 'enabled',
    value: true,
  })).toEqual(initialState.setIn(['cron', 'enabled'], true));
});

it('correctly adds an argument', () => {
  expect(reducer(undefined, {
    type: 'SERVICE_FORM_UPDATE_ARGS',
    name: 'seconds',
    value: 5,
  })).toEqual(initialState.setIn(['args', 'seconds'], 5));
});

it('correctly sets meta argument', () => {
  expect(reducer(undefined, {
    type: 'SERVICE_FORM_UPDATE_META',
    name: 'description',
    value: 'test description',
  })).toEqual(initialState.setIn(['meta', 'description'], 'test description'));
});


it('correctly sets service name', () => {
  expect(reducer(undefined, {
    type: 'SERVICE_FORM_SET_NAME',
    name: 'sleepTest',
  })).toEqual(initialState.set('serviceName', 'sleepTest'));
});

it('reverts to initial state on logout', () => {
  const updatedState = initialState
    .setIn(['cron', 'enabled'], true)
    .setIn(['args', 'seconds'], 5);
  expect(reducer(updatedState, { type: 'LOGOUT' }))
    .toEqual(initialState);
});

it('reverts to initial state on reset', () => {
  const updatedState = initialState
    .setIn(['cron', 'enabled'], true)
    .setIn(['args', 'seconds'], 5);
  expect(reducer(updatedState, { type: 'SERVICE_FORM_RESET' }))
    .toEqual(initialState);
});
