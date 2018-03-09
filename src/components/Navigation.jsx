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
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Icon from 'material-ui/Icon';
import settings from '../settings.json';

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
  },
};


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      drawerState: false,
    };

    this.handleMenu = this.handleMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
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

  handleDrawerClose() {
    this.setState({ drawerState: false });
  }

  handleDrawerOpen() {
    this.setState({ drawerState: true });
  }

  render() {
    const { classes, login } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);


    let auth = <Button color="inherit" component={Link} to="/login">Login</Button>;

    if (login.get('loggedIn')) {
      const avatarSrc = settings.avatarUrl.replace('<username>', login.get('username'));

      auth = (
        <IconButton color="inherit" onClick={this.handleMenu}>
          <Avatar className={classes.avatar} src={avatarSrc} />
        </IconButton>
      );
    }

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem button onClick={this.handleClose} component={Link} to="/">
            <ListItemIcon>
              <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.handleClose} component={Link} to="/jobs">
            <ListItemIcon>
              <Icon>play_circle_filled</Icon>
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem button onClick={this.handleClose} component={Link} to="/services">
            <ListItemIcon>
              <Icon>folder</Icon>
            </ListItemIcon>
            <ListItemText primary="Services List" />
          </ListItem>
        </List>
      </div>
    );

    return [
      <AppBar position="static" key="appbar">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleDrawerOpen}>
            <MenuIcon />
          </IconButton>

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
      </AppBar>,
      <Drawer open={this.state.drawerState} onClose={this.handleDrawerClose} key="drawer">
        <div
          tabIndex={0}
          role="button"
          onClick={this.handleDrawerClose}
          onKeyDown={this.handleDrawerClose}
        >
          {sideList}
        </div>
      </Drawer>,
    ];
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
