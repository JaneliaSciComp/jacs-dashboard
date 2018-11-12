import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Switch from '@material-ui/core/Switch';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Duration from 'duration';
import JobChildren from '../components/JobChildren';
import settings from '../settings.json';

const styles = theme => ({
  row: {
    display: 'flex',
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
  paper: {
    padding: theme.spacing.unit * 2,
    width: '100%',
    overflowX: 'auto',
  },
});

function parentLink(id) {
  const url = `/job/${id}`;
  return (
    <Link to={url}>{id}</Link>
  );
}

class TerminateConfirmationDialog extends Component {

  handleCancel = () => {
    this.props.onClose(false);
  };

  handleOk = () => {
    this.props.onClose(true);
  };

  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        {...this.props}
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Job Termination</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to terminate this job</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

    );
  }  
}

TerminateConfirmationDialog.propTypes = {
  onClose: PropTypes.func,
}

class Job extends Component {
  state = {
    confirmationOpen: false,
  }

  componentDidMount() {
    this.props.actions.loadJobData(this.props.match.params.jobId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.props.actions.loadJobData(this.props.match.params.jobId);
    }
  }

  handleChange = () => {
    this.props.actions.setShortDate(!this.props.shortDate);
  }

  handlePause = () => {
    this.props.actions.pauseJob(this.props.job.get('data').serviceId);
  }

  handleResume = () => {
    this.props.actions.resumeJob(this.props.job.get('data').serviceId);
  }

  handleConfirmTerminate = () => {
    this.setState({ confirmationOpen: true });
  }

  handleCloseConfirmTerminate = (value) => {
    this.setState({ confirmationOpen: false });
    if (value) {
      this.props.actions.cancelJob(this.props.job.get('data').serviceId);      
    }
  }

  eventsTable() {
    const { classes, shortDate } = this.props;

    const { events } = this.props.job.get('data');

    if (!events) {
      return 'None found';
    }

    // format the string in short form, unless specified otherwise
    const formatTemplate = (shortDate) ?
      'YYYY/MM/DD, hh:mm:ssA' :
      'YYYY/MM/DD, HH:mm:ss.SSS';

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>TimeStamp</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events && events.map((e, i) => (
            <TableRow key={i}>
              <TableCell>{e.name}</TableCell>
              <TableCell onClick={this.handleChange}>{format(parse(e.eventTime), formatTemplate)}</TableCell>
              <TableCell>{e.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  outputTable() {
    const { classes, job } = this.props;
    const { serviceId, outputPath, errorPath } = job.get('data');
    const { jobDataUrl } = settings;
    const requestUrl = jobDataUrl.replace('<job_id>', serviceId);
    const downloadJobOutputUrl = `${requestUrl}/job-output`
    const downloadJobErrorsUrl = `${requestUrl}/job-errors`

    let downloadOutput = () => {
      this.props.actions.download(downloadJobOutputUrl, serviceId + '-output.txt');
      return false;
    };

    let downloadErrors = () => {
      this.props.actions.download(downloadJobErrorsUrl, serviceId + '-errors.txt');
      return false;
    };

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Path</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Output Path</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell><a href="#" onClick={downloadOutput} download>{outputPath}</a></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Error Path</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell><a href="#" onClick={downloadErrors} download>{errorPath}</a></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  render() {
    const { classes, job } = this.props;

    const data = job.get('data');

    if (!data || !Object.prototype.hasOwnProperty.call(data, 'serviceId')) {
      return (<div>loading...</div>);
    }

    const runningTime = new Duration(parse(data.creationDate), parse(data.modificationDate));

    const rerunUrl = `/service/${data.name}/start`;

    return (
      <Grid container className={classes.row} spacing={8}>

        <Grid item md={8}>
          <div className={classes.row} key="1">
            <Typography align="center" variant="h4">{ data.state === 'ERROR' && (<Icon className={classes.error}>error</Icon>) }Job Status ({data.serviceId}) </Typography>
          </div>
          <div className={classes.row} key="type">
            <Typography>{data.name}</Typography>
          </div>
          <div className={classes.row} key="2">
            <Typography>{data.description}</Typography>
          </div>
          <div className={classes.row} key="3">
            <Typography>{data.state}</Typography>
          </div>
          <div className={classes.row} key="4">
            <Typography>{format(parse(data.creationDate), 'YYYY/MM/DD, h:mmA')}</Typography>
          </div>
          <div className={classes.row} key="5">
            <Typography>Owner: {data.ownerKey }</Typography>
          </div>

          { (data.rootServiceId) && (<Typography>Root: {parentLink(data.rootServiceId)}</Typography>)}
          { (data.parentServiceId) && (<Typography>Parent: {parentLink(data.parentServiceId)}</Typography>)}

          <Grid container className={classes.row}>
            <Grid item xs={12}>
              <Button variant="contained" size="small" onClick={this.handleConfirmTerminate.bind(this)}>Terminate</Button>
              <Button variant="contained" size="small" onClick={this.handlePause.bind(this)}>Pause</Button>
              <Button variant="contained" size="small" onClick={this.handleResume.bind(this)}>Restart</Button>
              <Button variant="contained" size="small" component={Link} to={rerunUrl}>Run with new Parameters</Button>
            </Grid>
          </Grid>
        </Grid>
        <TerminateConfirmationDialog
            classes={{
              paper: classes.paper,
            }}
            open={this.state.confirmationOpen}
            onClose={this.handleCloseConfirmTerminate.bind(this)}
          />

        <Grid item md={4}>
          <Grid container>
            <Typography>Progress Bar</Typography>
          </Grid>
          <Grid container>
            <Typography>Running Time: {runningTime.toString(1)}</Typography>
          </Grid>
          <Grid container>
            <Typography>Est. Running Time: </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.row}>
          <Grid item xs={12}>
            <Grid container key="title" className={classes.row}>
              <Grid item sm={12}>
                <Typography variant="h6">Children</Typography>
              </Grid>
            </Grid>
            <Grid container key="content" className={classes.row}>
              <Grid item sm={12}>
                <Paper className={classes.paper}>
                  <JobChildren parentId={data.serviceId} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={8}>
            <Typography variant="h6">Events</Typography>
          </Grid>
          <Grid item sm={4} align="right">
            Human Dates
            <Switch
              checked={this.props.shortDate}
              onChange={this.handleChange}
              value="dateToggle"
              color="primary"
            />
          </Grid>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              {this.eventsTable()}
            </Paper>
          </Grid>
          <Grid item sm={8}>
            <Typography variant="h6">Output</Typography>
          </Grid>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              {this.outputTable()}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Job.propTypes = {
  job: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  shortDate: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
