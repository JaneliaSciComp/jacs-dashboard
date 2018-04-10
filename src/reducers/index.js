import { combineReducers } from 'redux';
import app from './app';
import login from './login';
import services from './services';
import serviceForm from './service_form';
import scheduled from './scheduled';
import jobs from './jobs';
import quota from './quota';
import admin from './admin';

export default combineReducers({
  app,
  admin,
  jobs,
  login,
  quota,
  scheduled,
  services,
  serviceForm,
});
