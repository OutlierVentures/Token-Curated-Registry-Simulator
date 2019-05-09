import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Done from '@material-ui/icons/Done';
import Avatar from '@material-ui/core/Avatar';
import ListingItem from './api/ListingItem';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
  challengebutton: {
    margin: theme.spacing.unit,
    backgroundColor: '#FFF',
    '&:hover': {
      variant: 'cotained',
      color: '#FFF',
      backgroundColor: '#F00',
    },
  },
  applybutton: {
    margin: theme.spacing.unit,
    backgroundColor: '#FFF',
    '&:hover': {
      variant: 'cotained',
      color: '#FFF',
      backgroundColor: '#CCC',
    },
  },
  input: {
    display: 'none',
  },
  avatar: {
    margin: 10,
    width: 25,
    height: 25,
  },
});

const AcceptedList = ({ classes, listings }) => (
  <div className={classes.root}>
    <List id="AcceptedList">
      {listings.map(({ listingHash, name, artist, url }) => (
        <ListItem key={listingHash} dense button>
          <Avatar className={classes.avatar}>
            <Done />
          </Avatar>
          <ListItemText primary={`${name} - ${artist} (${url})`} />
        </ListItem>
      ))}
    </List>
  </div>
);

AcceptedList.propTypes = {
  listings: PropTypes.arrayOf(PropTypes.instanceOf(ListingItem)),
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

AcceptedList.defaultProps = {
  listings: [],
};

export default withStyles(styles)(AcceptedList);
