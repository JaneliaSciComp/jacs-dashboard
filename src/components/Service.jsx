import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Link } from 'react-router-dom';

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
    const name = match.params.serviceName;
    if (!services.get(name)) {
      this.props.actions.loadServiceData({ name });
    }
  }

  render() {
    const { classes, match, services } = this.props;
    const name = match.params.serviceName;

    const startUrl = `/service/${name}/start`;

    if (!services.get(name)) {
      return (<p> Loading </p>);
    }

    const serviceDetails = services.get(name);

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={10}>
            <Typography variant="display2">{name}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="raised"
              color="primary"
              aria-label="add"
              className={classes.button}
              component={Link}
              to={startUrl}
            >
              Start
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.main}>
              <Typography variant="title">Parameter List</Typography>
              <ParameterTable data={serviceDetails.serviceArgDescriptors} />
            </Paper>
            <Paper className={classes.main}>
              <Typography variant="title">Meta Information</Typography>
              <Typography>File sizes, Run Time, version numbers, dependencies?</Typography>
            </Paper>
            <Paper className={classes.main}>
              <Typography variant="title">Output</Typography>
              <Typography>Typical result files, error files, processing artifacts.</Typography>
            </Paper>
          </Grid>
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
