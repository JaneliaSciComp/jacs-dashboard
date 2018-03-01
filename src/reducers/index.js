import { combineReducers } from 'redux';
import app from './app';
import login from './login';
import services from './services';
import jobs from './jobs';

export default combineReducers({
  app,
  login,
  services,
  jobs,
});
