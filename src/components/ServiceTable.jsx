import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const styles = {
  root: {
    flexGrow: 1,
  },
};

// This data needs to come from the state, which needs to be loaded
// when the component mounts or when the filter field has been changed.

class ServiceTable extends Component {
  render() {
    const { classes, data } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Average Run Time</TableCell>
              <TableCell>Storage Usage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n) => {
              const url = `/service/${n.serviceName}`;
              return (
                <TableRow key={n.serviceName}>
                  <TableCell>
                    <Link to={url}>{n.serviceName}</Link>
                  </TableCell>
                  <TableCell>{n.description}</TableCell>
                  <TableCell>{n.avgRunTime}</TableCell>
                  <TableCell>{n.storageRequired}</TableCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>
      </Paper>

    );
  }
}

ServiceTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ServiceTable);
