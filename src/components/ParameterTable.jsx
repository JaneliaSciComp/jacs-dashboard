import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';

const styles = {
  root: {
    flexGrow: 1,
  },
  flags: {
    whiteSpace: 'nowrap',
  },
};

// This data needs to come from the state, which needs to be loaded
// when the component mounts or when the filter field has been changed.

class ParameterTable extends Component {
  render() {
    const { classes, data } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Parameter Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Flags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n) => {
              return (
                <TableRow key={n.argName}>
                  <TableCell>{n.argName}</TableCell>
                  <TableCell>{n.description}</TableCell>
                  <TableCell>{n.required ? <Icon color="primary">check_circle</Icon> : '' }</TableCell>
                  <TableCell className={classes.flags}><code>{n.cmdFlags.join(', ')}</code></TableCell>
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

ParameterTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(ParameterTable);
