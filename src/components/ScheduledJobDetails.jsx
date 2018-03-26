import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import CloseIcon from 'material-ui-icons/Close';
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
    this.state = {
      showError: true,
    };
    // bind it and make it an instance method instead of prototype method
    this.handleChange = this.handleChange.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }


  componentDidMount() {
    this.props.actions.loadScheduledServiceData(this.props.match.params.id);
  }

  handlePause() {
    const { match, scheduled } = this.props;
    const { id } = match.params;
    const data = scheduled.get(id);
    this.props.actions.toggleScheduled(id, data);
  }

  handleRestart() {
    const { match, scheduled } = this.props;
    const { id } = match.params;
    const data = scheduled.get(id);
    this.props.actions.toggleScheduled(id, data);
  }

  handleChange() {
    this.props.actions.setShortDate(!this.props.shortDate);
  }

  handleDelete() {
    const { match } = this.props;
    const { id } = match.params;
    this.props.actions.deleteScheduled(id);
  }

  handleClose() {
    this.setState({ showError: false });
  }

  showErrorMessage() {
    const error = this.props.scheduled.get('error');
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.showError}
        autoHideDuration={6000}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{error.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />);
  }


  render() {
    const { classes, scheduled } = this.props;

    const { id } = this.props.match.params;

    const data = scheduled.get(id);

    if (!data) {
      return (<div>loading...</div>);
    }

    const rerunUrl = `/service/${data.get('name')}/start`;

    return (
      <Grid container className={classes.row}>
        <Grid item md={8}>
          <div className={classes.row}>
            {(scheduled.get('error')) ?
              this.showErrorMessage() : ''}
            <Typography>{data.get('name')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>{data.get('state')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Last Started: {format(parse(data.get('lastStartTime')), 'YYYY/MM/DD, h:mmA')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Next Run: {format(parse(data.get('nextStartTime')), 'YYYY/MM/DD, h:mmA')}</Typography>
          </div>
          <div className={classes.row}>
            <Typography>Status: {(data.get('disabled')) ? 'disabled' : 'active'} </Typography>
          </div>

          <Grid container className={classes.row}>
            <Grid item xs={12}>
              <Button variant="raised" size="small">Terminate</Button>
              {(data.get('disabled')) ?
                (<Button variant="raised" size="small" onClick={this.handleRestart}>Restart</Button>) :
                (<Button variant="raised" size="small" onClick={this.handlePause}>Pause</Button>)}
              <Button variant="raised" size="small" onClick={this.handleDelete}>Delete</Button>
              <Button variant="raised" size="small" component={Link} to={rerunUrl}>Run with new Parameters</Button>
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
