import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ListingItem from './api/ListingItem';
import TcrConnection from './api/TcrConnection';

const styles = theme => ({
  updateButton: {
    margin: theme.spacing.unit,
    backgroundColor: '#FFF',
    '&:hover': {
      variant: 'contained',
      color: '#FFF',
      backgroundColor: '#195',
    },
  },
});

class UpdateStatus extends React.Component {
  handleUpdateStatus = () => {
    const { tcrConnection, listing } = this.props;
    tcrConnection.updateStatus(listing.listingHash);
  }

  render() {
    const { classes } = this.props;

    return (
      <Button
        variant="outlined"
        color="default"
        className={classes.updateButton}
        onClick={this.handleUpdateStatus}
      >
        Update
      </Button>
    );
  }
}

UpdateStatus.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  listing: PropTypes.instanceOf(ListingItem).isRequired,
  tcrConnection: PropTypes.instanceOf(TcrConnection).isRequired,
};

export default withStyles(styles)(UpdateStatus);
