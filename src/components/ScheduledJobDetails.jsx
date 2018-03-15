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
    // bind it and make it an instance method instead of prototype method
    this.handleChange = this.handleChange.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }


  componentDidMount() {
    this.props.actions.loadScheduledServiceData(this.props.match.params.id);
  }

  handlePause() {
    const { match, scheduled } = this.props;
    const { id } = match.params;
    const data = scheduled.get(id);
    this.props.actions.pauseScheduled(id, data);
  }

  handleChange() {
    this.props.actions.setShortDate(!this.props.shortDate);
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
    const { classes, scheduled } = this.props;

    const { id } = this.props.match.params;
 
    const data = scheduled.get(id);

    if (!data) {
      return (<div>loading...</div>);
    }

    const rerunUrl = `/service/${data.name}/start`;

    return (
      <Grid container className={classes.row}>
        <Grid item md={8}>
          <div className={classes.row} key="1">
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
              <Button variant="raised" size="small" onClick={this.handlePause}>Pause</Button>
              <Button variant="raised" size="small">Restart</Button>
              <Button variant="raised" size="small">Delete</Button>
              <Button variant="raised" size="small" component={Link} to={rerunUrl}>Run with new Parameters</Button>
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
            <Typography>Est. Running Time: </Typography>
          </Grid>
        </Grid>
      </Grid>
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
