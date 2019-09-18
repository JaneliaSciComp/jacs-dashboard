import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';
import settings from '../settings';


const styles = {
  table: {
    minWidth: 700,
  },
};

class JobChildren extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      children: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { parentId } = this.props;
    this.updateChildren(parentId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parentId !== this.props.parentId) {
      this.updateChildren(this.props.parentId);
    }
  }

  updateChildren(parentId) {
    const { jobListUrl } = settings;
    const childrenUrl = `${jobListUrl}?parent-id=${parentId}`;
    const cookies = new Cookies();
    const jwt = cookies.get('userId');
    fetch(childrenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      timeout: 4000,
    }).then((res) => {
      if (res.status === 401) {
        throw new Error('bad login');
      } else if (res.status >= 400) {
        throw new Error('server error');
      }
      return res.json();
    }).then((json) => {
      this.setState({
        children: json.resultList,
        loading: false,
      });
    }).catch((error) => {
      this.setState({
        error,
        loading: false,
      });
    });
  }


  childrenTable() {
    const { classes } = this.props;
    const { children } = this.state;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {children.map(e => (
            <TableRow key={e.serviceId}>
              <TableCell><Link to={`/job/${e.serviceId}`}>{e.serviceId}</Link></TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    const { children, loading, error } = this.state;
    if (loading) {
      return <CircularProgress />;
    } else if (error) {
      return <Typography>{error}</Typography>;
    } else if (children && children.length > 0) {
      return this.childrenTable();
    }
    return <Typography>None</Typography>;
  }
}

JobChildren.propTypes = {
  parentId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobChildren);
