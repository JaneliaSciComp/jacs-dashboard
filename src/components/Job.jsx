import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Switch from 'material-ui/Switch';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Duration from 'duration';
import JobChildren from '../components/JobChildren';

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

class Job extends Component {
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
    const { outputPath, errorPath } = job.get('data');
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
            <TableCell>{outputPath}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Error Path</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>{errorPath}</TableCell>
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
            <Typography align="center" variant="display1">{ data.state === 'ERROR' && (<Icon className={classes.error}>error</Icon>) }Job Status ({data.serviceId}) </Typography>
          </div>
          <div className={classes.row} key="type">
            <Typography>{data.name}</Typography>
          </div>

          <div className={classes.row} key="2">
            <Typography>{data.state}</Typography>
          </div>
          <div className={classes.row} key="3">
            <Typography>{format(parse(data.creationDate), 'YYYY/MM/DD, h:mmA')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Owner: {data.ownerKey}</Typography>
          </div>

          { (data.rootServiceId) && (<Typography>Root: {parentLink(data.rootServiceId)}</Typography>)}
          { (data.parentServiceId) && (<Typography>Parent: {parentLink(data.parentServiceId)}</Typography>)}

          <Grid container className={classes.row}>
            <Grid item xs={12}>
              <Button variant="raised" size="small">Terminate</Button>
              <Button variant="raised" size="small">Pause</Button>
              <Button variant="raised" size="small">Restart</Button>
              <Button variant="raised" size="small" component={Link} to={rerunUrl}>Run with new Parameters</Button>
            </Grid>
          </Grid>
        </Grid>
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
                <Typography variant="title">Children</Typography>
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
            <Typography variant="title">Events</Typography>
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
            <Typography variant="title">Output</Typography>
          </Grid>
          <Grid item sm={4} className={classes.download}>
            <Button variant="raised" size="small">Download</Button>
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
