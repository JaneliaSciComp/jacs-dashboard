import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Zoom from 'material-ui/transitions/Zoom';
import { withStyles } from 'material-ui/styles';

const clements = require('../assets/clements.jpg');

const styles = theme => ({
  row: {
    display: 'flex',
    justifyContent: 'center',
    'margin-top': theme.spacing.unit * 10,
  },
  avatar: {
    margin: theme.spacing.unit,
  },
  bigAvatar: {
    width: 100,
    height: 100,
  },
  tagLine: {
    'margin-top': theme.spacing.unit * 6,
  },
});

class About extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Zoom in style={{ transitionDelay: 500 }}>
        <div className={classes.row}>
          <Avatar
            alt="Jody Clements"
            src={clements}
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <Typography align="center" className={classes.tagLine}>Crafted with care by Jody Clements</Typography>
        </div>
      </Zoom>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
