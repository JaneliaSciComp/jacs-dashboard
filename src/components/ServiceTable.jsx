import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => (
              <TableRow key={n.serviceName}>
                <TableCell>{n.serviceName}</TableCell>
                <TableCell>{n.description}</TableCell>
              </TableRow>
              ))
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
