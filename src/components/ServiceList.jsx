import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ServiceTable from './ServiceTable';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class ServiceList extends Component {
  constructor(...args) {
    super(...args);
    // bind it and make it an instance method instead of prototype method
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadServiceData();
  }

  handleChange(e) {
    this.props.actions.loadServiceData({ filter: e.target.value });
  }

  render() {
    const { classes, services } = this.props;

    let dataGrid = null;

    if (services.get('error')) {
      dataGrid = (<p>There was a problem contacting the server.</p>);
    } else if (services.get('data')) {
      const data = services.get('data');
      dataGrid = <ServiceTable data={data} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography align="left" variant="h3">Services List</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="search"
              label="Filter"
              type="search"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            {dataGrid}
          </Grid>
        </Grid>
      </div>
    );
  }
}

ServiceList.propTypes = {
  classes: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(ServiceList);
