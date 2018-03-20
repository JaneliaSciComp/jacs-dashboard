import { combineReducers } from 'redux';
import app from './app';
import login from './login';
import services from './services';
import serviceForm from './service_form';
import scheduled from './scheduled';
import jobs from './jobs';
import quota from './quota';

export default combineReducers({
  app,
  login,
  services,
  serviceForm,
  jobs,
  quota,
  scheduled,
});
