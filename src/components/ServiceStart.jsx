import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import ParameterForm from '../containers/ParameterForm';

const styles = {
  row: {
    display: 'flex',
  },
  main: {
    padding: '1em',
    marginTop: '1em',
  },
};

class Service extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      value: 'one',
    };
    // bind it and make it an instance method instead of prototype method
    this.handleChange = this.handleChange.bind(this);
    this.handleAdvanced = this.handleAdvanced.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCronToggle = this.handleCronToggle.bind(this);
    this.handleCronArgs = this.handleCronArgs.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    // reset the saved parameters to their defaults here
    this.props.actions.resetServiceForm();

    const name = match.params.serviceName;

    this.props.actions.loadServiceData({ name });
    this.props.actions.setServiceName(name);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleAdvanced = (event) => {
    const { actions } = this.props;
    actions.setMeta(event.target.id, event.target.value);
  };

  handleSubmit = () => {
    const { actions, serviceForm, login } = this.props;
    // TODO: in order to allow an admin user to run processes as
    // a different user, we need to check that the logged in user is
    // admin and then allow them to override this line with input of
    // their own.
    const formWithLogin = serviceForm.set('runServiceAs', login.get('user').key);
    actions.startService(formWithLogin);
  };

  handleCronToggle = (event) => {
    const { actions } = this.props;
    actions.toggleScheduled(event.target.checked);
  };

  handleCronArgs = (event) => {
    const { actions } = this.props;
    actions.setCron(event.target.id, event.target.value);
  };

  parameters() {
    const { services, match } = this.props;
    const name = match.params.serviceName;
    const serviceDetails = services.get(name);

    return [
      <Typography key="title" variant="title">Parameter List</Typography>,
      <ParameterForm key="form" data={serviceDetails.serviceArgDescriptors} name={serviceDetails.serviceName} />,
    ];
  }

  advancedParams() {
    const { serviceForm } = this.props;
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography key="title" variant="title">Advanced Paramters</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={3}>
              <Typography align="right">description</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField id="description" label="description" value={serviceForm.get('meta').get('description', '')} onChange={this.handleAdvanced} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={3}>
              <Typography align="right">processingLocation</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField id="processingLocation" label="processingLocation" value={serviceForm.get('meta').get('processingLocation')} onChange={this.handleAdvanced} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  cronParams() {
    const { serviceForm } = this.props;
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography key="title" variant="title">Scheduled Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Switch
            checked={serviceForm.get('cron').get('enabled')}
            onChange={this.handleCronToggle}
            value="dateToggle"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={3}>
              <Typography align="right">name</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField id="name" label="name" value={serviceForm.get('cron').get('name', '')} onChange={this.handleCronArgs} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={3}>
              <Typography align="right">description</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField id="description" label="description" value={serviceForm.get('meta').get('description', '')} onChange={this.handleAdvanced} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const {
      classes,
      match,
      services,
      serviceForm,
    } = this.props;
    const name = match.params.serviceName;
    const { value } = this.state;

    if (!services.get(name)) {
      return (<p> Loading </p>);
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography variant="display2">Start: {name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.main}>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab value="one" label="Parameter List" />
                <Tab value="two" label="Scheduled Settings" />
                <Tab value="three" label="Advanced Settings" />
              </Tabs>
              { value === 'one' && this.parameters() }
              { value === 'two' && this.cronParams() }
              { value === 'three' && this.advancedParams() }

            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button variant="fab" color="secondary" aria-label="submit" onClick={this.handleSubmit}><Icon>play_arrow</Icon></Button>
          </Grid>
        </Grid>
        <Prompt when={serviceForm.get('modified')} message="Any changes you have made will be lost. Are you sure you want to leave?" />
      </div>
    );
  }
}

Service.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  serviceForm: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
};

export default withStyles(styles)(Service);
