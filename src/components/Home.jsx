import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, LabelList, ResponsiveContainer } from 'recharts';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typ from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import parse from 'date-fns/parse';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import './Home.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    'margin-top': '1em',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    position: 'relative',
  },
  fixed: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});


class Home extends Component {
  componentDidMount() {
    const user = this.props.login.get('user');
    this.props.actions.loadJobList(user.key);
    this.props.actions.quotaReport(user.name);
    this.props.actions.loadCapacity(user.key);
  }

  buildTable() {
    const list = this.props.jobs.get('list');
    return list.resultList.map((item) => {
      const { name } = item;
      const detailsUrl = `/job/${item.serviceId}`;
      return (
        <TableRow key={item.serviceId}>
          <TableCell><Link to={detailsUrl}>{name}</Link></TableCell>
          <TableCell>{item.state}</TableCell>
          <TableCell>{distanceInWordsToNow(parse(item.processStartTime))} ago</TableCell>
          <TableCell>{distanceInWordsToNow(parse(item.modificationDate))} ago</TableCell>
        </TableRow>
      );
    });
  }

  jobsList() {
    const { classes } = this.props;

    if (this.props.jobs.get('error')) {
      return (<Paper className={classes.paper}><Typ>Error loading jobs list!!</Typ></Paper>);
    } else if (!this.props.jobs.get('list_loaded')) {
      return (<Paper className={classes.paper}><Typ>Loading...</Typ></Paper>);
    }

    return (
      <Paper className={classes.paper}>
        <Typ>You have processed ({this.props.jobs.get('list').resultList.length}) jobs <Link to="/jobs">See all</Link></Typ>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Last Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.buildTable()}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  storageUsage() {
    const report = this.props.quota.get('report');
    const { classes } = this.props;

    if (!report) {
      return (
        <Typ>Loading</Typ>
      );
    }

    const user = this.props.login.get('user');
    const userReport = report[user.name];

    const data = [
      {
        name: `Used (${Math.round(userReport.spaceUsedTB)}TB)`,
        value: userReport.spaceUsedTB,
      },
      {
        name: `Free (${Math.round(userReport.totalSpaceTB - userReport.spaceUsedTB)}TB)`,
        value: userReport.totalSpaceTB - userReport.spaceUsedTB,
      },
    ];

    const percentage = Math.round(userReport.percentUsage * 100);

    return (
      <Paper className={classes.paper}>
        <Typ variant="title">Lab Storage Usage</Typ>
        <Typ>{percentage}% of alloted storage used.</Typ>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={300} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#5bc0de" isAnimationActive={false}>
              <LabelList dataKey="name" position="inside" />
              <Cell fill="#1490ac" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    );
  }

  currentCapcity() {
    const { stats, classes } = this.props;

    if (!stats.get('cap_loaded')) {
      return (<Typ>Loading...</Typ>);
    }

    const capacity = stats.get('capacity');

    return (
      <Paper className={classes.paper}>
        <Typ variant="title">Current Service Capacity</Typ>
        <Typ>Available Slots: {capacity.availableSlots - capacity.runningServices.length}</Typ>
        <Typ>Wait Capacity: {capacity.waitingCapacity}</Typ>
        <Typ><Link href="/running" to="/running">Running Services</Link>: {capacity.runningServices.length}</Typ>
        <Typ className={classes.fixed}><Link href="/admin" to="/admin">Edit</Link></Typ>
      </Paper>
    );
  }

  render() {
    const { classes } = this.props;

    return [
      <Grid key="contents" container spacing={24} className={classes.root}>
        <Grid item sm={4}>
          <Grid container spacing={24}>
            <Grid item sm={12}>
              <Button variant="raised" color="secondary" component={Link} to="/services">Start A Service</Button>
            </Grid>
            <Grid item sm={12}>
              {this.currentCapcity()}
            </Grid>
            <Grid item sm={12}>
              {this.storageUsage()}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={8}>
          <Grid container spacing={24}>
            <Grid item sm={12}>
              {this.jobsList()}
            </Grid>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Typ>Scheduled Jobs</Typ>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>,
    ];
  }
}

Home.propTypes = {
  login: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  jobs: PropTypes.object.isRequired,
  quota: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
