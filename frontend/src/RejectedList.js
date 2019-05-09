import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListingItem from './api/ListingItem';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: 10,
    width: 25,
    height: 25,
  },
});

const RejectedList = (props) => {
  const { classes, listings } = props;

  return (
    <div className={classes.root}>
      <List>
        {listings.map(listing => ( // eslint-disable-line react/destructuring-assignment
          <ListItem key={listing} dense button>
            <Avatar className={classes.avatar}>
              <i className="material-icons md-18">clear</i>
            </Avatar>
            <ListItemText primary={`${listing.name} - ${listing.artist} (${listing.url})`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

RejectedList.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  listings: PropTypes.arrayOf(PropTypes.instanceOf(ListingItem)),
};

RejectedList.defaultProps = {
  listings: [],
};

export default withStyles(styles)(RejectedList);
