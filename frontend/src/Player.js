import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import SettingsFrame from './SettingsFrame';
import TokenBalance from './components/TokenBalance';

const styles = {
  root: {
    height: '100%',
  },
  content: {
    height: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  settingFrame: {
    height: '100%',
    overflow: 'auto',
    zIndex: 10,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Player extends React.Component {
  state = {
    anchorEl: null,
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.props.history.push('/profile'); // eslint-disable-line 
    this.setState({ anchorEl: null });
  }

  handleSwitch = () => {
    this.props.history.push('/admin'); // eslint-disable-line 
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="relative" color="primary" elevation={2}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              TCR Simulator
            </Typography>
            <TokenBalance />
            <div>
              <Switch onChange={this.handleSwitch} />
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorE1={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                getContentAnchorEl={null}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <SettingsFrame className={classes.settingFrame} />
      </div>
    );
  }
}

Player.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(Player);
