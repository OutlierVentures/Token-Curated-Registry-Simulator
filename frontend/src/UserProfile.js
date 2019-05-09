import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import UserDashboard from './UserDashboard';
import UserProfileCard from './UserProfileCard';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  grow: {
    flexGrow: 1,
  },
  root: {
    height: '100%',
  },

};


class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleMenu = () => {
    this.props.history.push('/player'); //eslint-disable-line
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="relative" color="primary" elevation={2}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" color="inherit" className={classes.grow}>
               TCR Simulator
            </Typography>
            <IconButton
              aria-haspopup="true"
              onClick={this.handle}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <UserProfileCard />
        <UserDashboard />
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
UserProfile.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

/* eslint-enable react/no-unused-prop-types */
export default withStyles(styles)(UserProfile);
