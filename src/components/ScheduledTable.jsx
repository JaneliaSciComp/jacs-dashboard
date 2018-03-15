import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

const styles = {
  root: {
    flexGrow: 1,
  },
};

// This data needs to come from the state, which needs to be loaded
// when the component mounts or when the filter field has been changed.

class ScheduledTable extends Component {
  render() {
    const { classes, data } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Next Run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n) => {
              const url = `/service/scheduled/${n._id}`;
              return (
                <TableRow key={n._id}>
                  <TableCell>
                    <Link to={url}>{n.name}</Link>
                  </TableCell>
                  <TableCell>{n.description}</TableCell>
                  <TableCell>{n.cronScheduleDescriptor}</TableCell>
                  <TableCell>{(n.lastStartTime) ? format(parse(n.lastStartTime), 'YYYY/MM/DD, hh:mm:ssA') : 'None'}</TableCell>
                  <TableCell>{(n.nextStartTime) ? format(parse(n.nextStartTime), 'YYYY/MM/DD, hh:mm:ssA') : 'None'}</TableCell>
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

ScheduledTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ScheduledTable);
