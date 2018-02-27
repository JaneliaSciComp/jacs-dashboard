import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  avatar: {
    background: '#000',
  }
};


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mainAnchorEl: null,
    };

    this.handleMainMenu = this.handleMainMenu.bind(this);
    this.handleMainClose = this.handleMainClose.bind(this);

    this.handleMenu = this.handleMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleMainMenu(e) {
    this.setState({ mainAnchorEl: e.currentTarget });
  }

  handleMainClose() {
    this.setState({ mainAnchorEl: null });
  }


  handleMenu(e) {
    this.setState({ anchorEl: e.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  handleLogout() {
    const { actions } = this.props;
    this.setState({ anchorEl: null });
    actions.logout();
  }

  render() {
    const { classes, login } = this.props;
    const { anchorEl, mainAnchorEl } = this.state;
    const open = Boolean(anchorEl);
    const mainOpen = Boolean(mainAnchorEl);


    let auth = <Button color="inherit" component={Link} to="/login">Login</Button>;

    if (login.get('loggedIn')) {
      const initials = login.get('user').fullName.split(' ').map(name => name.charAt(0)).join('');
      auth = (
        <IconButton color="inherit" onClick={this.handleMenu}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
        </IconButton>
      );
    }

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleMainMenu}>
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-main"
            anchorEl={mainAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={mainOpen}
            onClose={this.handleMainClose}
          >
            <MenuItem onClick={this.handleClose} component={Link} to="/">Home</MenuItem>
            <MenuItem onClick={this.handleClose} component={Link} to="/jobs">Jobs</MenuItem>
            <MenuItem onClick={this.handleClose} component={Link} to="/services">Services</MenuItem>
          </Menu>


          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>

          <div className={classes.flex}>
            <Button color="inherit" component={Link} to="/">
              <Typography variant="title" color="inherit" >
                JACS v2
              </Typography>
            </Button>
          </div>
          {auth}
        </Toolbar>
      </AppBar>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
