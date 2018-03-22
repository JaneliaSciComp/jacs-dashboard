import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { Link } from 'react-router-dom';
import qs from 'qs';
import Chip from 'material-ui/Chip';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import { isAdminUser } from '../lib/user-utility';
import settings from '../settings.json';

const styles = {
  row: {
    display: 'flex',
  },
};

function pageNumber(location) {
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
  let page = 0;
  if (Object.prototype.hasOwnProperty.call(queryParams, 'p')) {
    page = queryParams.p;
  }
  return parseInt(page, 10);
}


class JobStatusList extends Component {
  componentDidMount() {
    const user = this.props.login.get('user');
    const page = pageNumber(this.props.location);

    let username = user.key;
    if (isAdminUser(user)) {
      username = null;
    }
    this.props.actions.loadJobList(username, page);
  }

  componentWillReceiveProps(nextProps) {
    const nextPage = pageNumber(nextProps.location);
    const currentPage = pageNumber(this.props.location);
    if (nextPage !== currentPage) {
      const user = this.props.login.get('user');
      let username = user.key;
      if (isAdminUser(user)) {
        username = null;
      }

      this.props.actions.loadJobList(username, nextPage);
    }
  }

  buildTable() {
    const list = this.props.jobs.get('list');
    return list.resultList.map((item) => {
      const { name } = item;
      const detailsUrl = `/job/${item.serviceId}`;

      let username = 'unknown';
      if (Object.prototype.hasOwnProperty.call(item, 'ownerKey') && item.ownerKey) {
        username = item.ownerKey.split(':')[1];
      } else if (Object.prototype.hasOwnProperty.call(item, 'authKey') && item.authKey) {
        username = item.authKey.split(':')[1];
      }

      const avatarSrc = settings.avatarUrl.replace('<username>', username);

      const auth = (
        <Chip
          avatar={<Avatar src={avatarSrc} />}
          label={username}
          onClick={this.handleMenu}
        />
      );

      return (
        <TableRow key={item.serviceId}>
          <TableCell><Link to={detailsUrl}>{name}</Link></TableCell>
          <TableCell>{item.state}</TableCell>
          <TableCell>{format(parse(item.processStartTime), 'YYYY/MM/DD, h:mmA')}</TableCell>
          <TableCell>{format(parse(item.modificationDate), 'YYYY/MM/DD, h:mmA')}</TableCell>
          <TableCell>{auth}</TableCell>
          <TableCell>{item.processingLocation}</TableCell>
        </TableRow>
      );
    });
  }


  render() {
    const { classes } = this.props;

    if (this.props.jobs.get('error')) {
      return (<p>There was a problem contacting the server.</p> );
    } else if (this.props.jobs.get('list_loaded')) {
      const page = pageNumber(this.props.location);
      const nextPage = `/jobs?p=${1 + page}`;
      return [
        <Grid container key="title" className={classes.row}>
          <Grid item xs={8}>
            <Typography variant="display2">Jobs List</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link to={nextPage} >Next</Link>
          </Grid>
        </Grid>,
        <Grid key="table" className={classes.row}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Last Modified</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Processed @</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.buildTable()}
            </TableBody>
          </Table>
        </Grid>
      ];
    }

    return (
      <div className={classes.row}>
        <Typography align="center" variant="display2">Jobs List</Typography>
      </div>
    );
  }
}

JobStatusList.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
  jobs: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobStatusList);
