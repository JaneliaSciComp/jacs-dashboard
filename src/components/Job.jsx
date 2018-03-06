import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Duration from 'duration';

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
};

class Job extends Component {
  componentDidMount() {
    this.props.actions.loadJobData(this.props.match.params.jobId);
  }

  eventsTable() {
    const { classes } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>TimeStamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.job.get('data').events.map((e, i) => (
            <TableRow key={i}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{format(parse(e.eventTime), 'YYYY/MM/DD, h:mmA')}</TableCell>
              <TableCell>{e.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  childrenTable() {
    const { classes } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.job.get('data').dependenciesIds.map(e => (
            <TableRow key={e}>
              <TableCell><Link to={`/job/${e}`}>{e}</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }


  outputTable() {
    const { classes } = this.props;
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
            <TableCell>File Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Path</TableCell>
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

    return (
      <Grid container className={classes.row}>
        <Grid item md={8}>
          <div className={classes.row} key="1">
            <Typography align="center" variant="display1">Job Status ({data.serviceId}) </Typography>
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

          <Grid container className={classes.row}>
            <Grid item xs={12}>
              <Button variant="raised" size="small">Terminate</Button>
              <Button variant="raised" size="small">Pause</Button>
              <Button variant="raised" size="small">Restart</Button>
              <Button variant="raised" size="small">Delete</Button>
              <Button variant="raised" size="small">Run with new Parameters</Button>
            </Grid>
          </Grid>

          <Grid container className={classes.row}>
            <Grid item sm={12}>
              <Typography variant="title">Children</Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.row}>
            <Grid item sm={12}>
              <Paper className={classes.tableRoot}>
                {this.childrenTable()}
              </Paper>
            </Grid>
          </Grid>


          <Grid container className={classes.row}>
            <Grid item sm={12}>
              <Typography variant="title">Events</Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.row}>
            <Grid item sm={12}>
              <Paper className={classes.tableRoot}>
                {this.eventsTable()}
              </Paper>
            </Grid>
          </Grid>

          <Grid container className={classes.row}>
            <Grid item sm={8}>
              <Typography variant="title">Output</Typography>
            </Grid>
            <Grid item sm={4} className={classes.download}>
              <Button variant="raised" size="small">Download</Button>
            </Grid>
          </Grid>
          <Grid container className={classes.row}>
            <Grid item sm={12}>
              <Paper className={classes.tableRoot}>
                {this.outputTable()}
              </Paper>
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
      </Grid>
    );
  }
}

Job.propTypes = {
  job: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
