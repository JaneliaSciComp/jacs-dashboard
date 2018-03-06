import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { Link } from 'react-router-dom';
import { isAdminUser } from '../lib/user-utility';

const styles = {
  row: {
    display: 'flex',
  },
};

class JobStatusList extends Component {
  componentDidMount() {
    const user = this.props.login.get('user');
    let username = user.key;
    if (isAdminUser(user)) {
      username = null;
    }
    this.props.actions.loadJobList(username);
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
          <TableCell>{format(parse(item.processStartTime), 'YYYY/MM/DD, h:mmA')}</TableCell>
          <TableCell>{format(parse(item.modificationDate), 'YYYY/MM/DD, h:mmA')}</TableCell>
          <TableCell>{item.ownerKey}</TableCell>
          <TableCell>{item.processingLocation}</TableCell>
        </TableRow>
      );
    });
  }


  render() {
    const { classes } = this.props;

    if (this.props.jobs.get('list_loaded')) {
      return (
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
      );
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
};

export default withStyles(styles)(JobStatusList);
