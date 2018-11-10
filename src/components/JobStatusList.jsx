import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import { Link } from 'react-router-dom';
import qs from 'qs';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import queryString from 'query-string';
import TablePaginationActions from './TablePaginationActions';
import { isAdminUser } from '../lib/user-utility';
import SortableTableHeader from '../containers/SortableTableHeader';
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

function getSort(location) {
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
  let sort = '';

  if (Object.prototype.hasOwnProperty.call(queryParams, 'sort-by')) {
    sort = queryParams['sort-by'];
  }
  return sort;
}


class JobStatusList extends Component {
  componentDidMount() {
    const user = this.props.login.get('user');
    const page = pageNumber(this.props.location);
    const sortBy = getSort(this.props.location);

    let username = user.key;
    if (isAdminUser(user)) {
      username = null;
    }
    this.props.actions.loadJobList(username, page, sortBy);
  }

  componentWillReceiveProps(nextProps) {
    const nextPage = pageNumber(nextProps.location);
    const currentPage = pageNumber(this.props.location);
    const nextSortBy = getSort(nextProps.location);
    const currentSortBy = getSort(this.props.location);

    if (nextPage !== currentPage || nextSortBy !== currentSortBy) {
      const user = this.props.login.get('user');
      let username = user.key;
      if (isAdminUser(user)) {
        username = null;
      }

      this.props.actions.loadJobList(username, nextPage, nextSortBy);
    }
  }

  handleChangePage = (event, page) => {
    // update the page number, but preserve the other query
    // string parameters.
    const { location, history } = this.props;
    const parsedQuery = queryString.parse(location.search);
    parsedQuery.p = page;
    const updatedQuery = queryString.stringify(parsedQuery);
    const updatedUrl = `${location.pathname}?${updatedQuery}`;
    history.push(updatedUrl);
  }

  buildTable() {
    const list = this.props.jobs.get('list');
    return list.resultList.map((item) => {
      const { name } = item;
      const detailsUrl = `/job/${item.serviceId}`;

      let username = 'unknown';
      if (Object.prototype.hasOwnProperty.call(item, 'ownerKey') && item.ownerKey) {
        [, username] = item.ownerKey.split(':');
      } else if (Object.prototype.hasOwnProperty.call(item, 'authKey') && item.authKey) {
        [, username] = item.authKey.split(':');
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
    const list = this.props.jobs.get('list');
    const { pageSize, totalCount } = list;

    if (this.props.jobs.get('error')) {
      return (<p>There was a problem contacting the server.</p>);
    } else if (this.props.jobs.get('list_loaded')) {
      const page = pageNumber(this.props.location);

      const columns = [
        { label: 'Name', id: 'name' },
        { label: 'State', id: 'state' },
        { label: 'Start Time', id: 'processStartTime' },
        { label: 'Last Modified', id: 'modificationDate' },
        { label: 'Owner', id: 'ownerKey' },
        { label: 'Processed @', id: 'processingLocation' },
      ];

      return [
        <Grid container key="title" className={classes.row}>
          <Grid item xs={8}>
            <Typography variant="h3">Service History</Typography>
          </Grid>
        </Grid>,
        <Grid key="table" className={classes.row}>
          <Table className={classes.table}>
            <SortableTableHeader columns={columns} sortBy={getSort(this.props.location)} />
            <TableBody>
              {this.buildTable()}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={totalCount}
                  rowsPerPage={pageSize}
                  rowsPerPageOptions={[100]}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  actions={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>,
      ];
    }

    return (
      <div className={classes.row}>
        <Typography align="center" variant="h3">Service History</Typography>
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
  history: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobStatusList);
