import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import ParameterTable from './ParameterTable';

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
  componentDidMount() {
    const { match, services } = this.props;
    const name = match.params.serviceId;
    if (!services.get(name)) {
      this.props.actions.loadServiceData({ name });
    }
  }

  render() {
    const { classes, match, services } = this.props;
    const name = match.params.serviceId;

    if (!services.get(name)) {
      return (<p> Loading </p>);
    }

    const serviceDetails = services.get(name);

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography align="center" variant="display2">Service Information ({name}) </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.main}>
            <Typography variant="title">Parameter List</Typography>
            <ParameterTable data={serviceDetails.serviceArgDescriptors} />
          </Paper>
        </Grid>
      </div>
    );
  }
}

Service.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Service);
