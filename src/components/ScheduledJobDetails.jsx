import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Cron from 'cron-converter';
import cronstrue from 'cronstrue';
import Paper from "@material-ui/core/Paper";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

const styles = {
  row: {
    display: 'flex',
  },
  tableRoot: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  download: {
    textAlign: 'right',
  },
  error: {
    color: '#f00',
    fontSize: '1em',
  },
};

class ScheduledJob extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showError: true,
    };
    // bind it and make it an instance method instead of prototype method
    this.handleChange = this.handleChange.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadScheduledServiceData(this.props.match.params.id);
  }

  handlePause() {
    const { match, scheduled } = this.props;
    const { id } = match.params;
    const data = scheduled.get(id);
    this.props.actions.toggleScheduled(id, data);
  }

  handleRestart() {
    const { match, scheduled } = this.props;
    const { id } = match.params;
    const data = scheduled.get(id);
    this.props.actions.toggleScheduled(id, data);
  }

  handleChange() {
    this.props.actions.setShortDate(!this.props.shortDate);
  }

  handleDelete() {
    const { match } = this.props;
    const { id } = match.params;
    this.props.actions.deleteScheduled(id);
  }

  handleClose() {
    this.setState({ showError: false });
  }

  showErrorMessage() {
    const error = this.props.scheduled.get('error');
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.showError}
        autoHideDuration={6000}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{error.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />);
  }


  render() {
    const { classes, scheduled } = this.props;

    const { id } = this.props.match.params;

    const data = scheduled.get(id);

    if (!data) {
      return (<div>loading...</div>);
    }

    const rerunUrl = `/service/${data.get('serviceName')}/start`;

    const cronInstance = new Cron();

    const schedule = cronInstance.fromString(data.get('cronScheduleDescriptor')).schedule();
    const lastStartTime = data.get('lastStartTime');

    return (
      <Grid container className={classes.row}>
        <Grid item md={8}>
          <div className={classes.row}>
            {(scheduled.get('error')) ?
              this.showErrorMessage() : ''}
            <Typography>{data.get('name')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>{data.get('state')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Last Run: {lastStartTime ? format(parse(lastStartTime), 'MMMM Do YYYY, h:mm:ss a') : 'Never'}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Next Run: {(data.get('disabled')) ? 'Never' : schedule.next().format('MMMM Do YYYY, h:mm:ss a')}</Typography>
          </div>
          <div className={classes.row}>
            <Tooltip title={data.get('cronScheduleDescriptor')} placement="right">
              <Typography>Cron Schedule: {cronstrue.toString(data.get('cronScheduleDescriptor'))}</Typography>
            </Tooltip>
          </div>
          <div className={classes.row} key="5">
            <Typography>Run service as: {data.get('runServiceAs') }</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Status: {(data.get('disabled')) ? 'disabled' : 'active'} </Typography>
          </div>
          <div>
            { this.renderJobControlButtons(classes, data.get('disabled'), rerunUrl) }
          </div>
        </Grid>

        <Grid item md={4}>
          <Grid container>
            <Typography>Progress Bar</Typography>
          </Grid>
          <Grid container>
            <Typography>Est. Running Time: </Typography>
          </Grid>
        </Grid>

        <Grid item sm={8}>
          <Typography variant="h6">Service Arguments</Typography>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            { this.argsTable(classes, data) }
          </Paper>
        </Grid>

      </Grid>
    );
  }

  renderJobControlButtons(classes, disabled, rerunUrl) {
    return (
        <Grid container className={classes.row}>
          <Grid item xs={12}>
            <Button variant="contained" size="small">Terminate</Button>
            {(disabled) ?
                (<Button variant="contained" size="small" onClick={this.handleRestart}>Restart</Button>) :
                (<Button variant="contained" size="small" onClick={this.handlePause}>Pause</Button>)}
            <Button variant="contained" size="small" onClick={this.handleDelete}>Delete</Button>
            <Button variant="contained" size="small" component={Link} to={rerunUrl}>Run with new Parameters</Button>
          </Grid>
        </Grid>
    );
  }

  argsTable(classes, data) {

    console.log("test")
    const serviceArgs = data.get('serviceArgs');
    const serviceResources = data.get('serviceResources');
    const serviceDictionaryArgs = data.get('serviceDictionaryArgs');
    const strDictArgs = JSON.stringify(serviceDictionaryArgs, undefined, 2);
    const strResources = JSON.stringify(serviceResources,undefined, 2);

    return (
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>Command Line:</TableCell>
              <TableCell><Typography>{serviceArgs.map(arg => '\'' + arg + '\'').join(',')}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dictionary Argumemts:</TableCell>
              <TableCell><Typography><pre>{strDictArgs}</pre></Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Resources:</TableCell>
              <TableCell><Typography><pre>{strResources}</pre></Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
    );
  }

}

ScheduledJob.propTypes = {
  scheduled: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  shortDate: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ScheduledJob);
