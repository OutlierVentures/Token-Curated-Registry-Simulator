import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import ListingItem from './api/ListingItem';

import CustomizedTooltips from './InformationButton';

const styles = theme => ({
  subtitle: {
    display: 'inline',
    paddingLeft: 6,
    marginTop: 1,
    position: 'flex',
    flexDirection: 'column',
  },
  dialogBox: {
    maxWidth: '80%',
  },
  subtitleIcon: {
    display: 'inline',
    padding: 3,
  },
  listItemText: {
    marginLeft: 10,
  },
  ListItem: {
    marginTop: 10,
    marginBottom: 17,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  section: {
    display: 'flex',
    borderBottom: '1px solid rgb(0,0,0,.25)',
  },
  withSection: {
    display: 'flex',
    marginTop: 10,
    marginBottom: -5,
  },
  selected: {
    color: 'grey',
    marginLeft: 10,
  },
  submitWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  submitButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class WithdrawBox extends React.Component {
  state = {
    amount: 0,
    loading: false,
    snackbarOpen: false,
    snackbarMessage: '',
  };

  handleAmount = () => (event) => {
    const amount = event.target.value;
    this.setState({ amount });
  }

  handleWithdraw = () => async () => {
    const { handleSuccess, tcrConnection, listing } = this.props;
    const { amount } = this.state;
    await tcrConnection.withdraw(listing.listingHash, amount);
    handleSuccess(listing);
  }

  handleSnackbarClose = () => () => {
    this.setState({ snackbarOpen: false });
  }

  render() {
    const { classes, open, handleCancel } = this.props;
    const { loading, snackbarOpen, snackbarMessage } = this.state;

    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
        className={classes.dialogBox}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Withdraw your Submission
        </DialogTitle>
        <DialogContent>
          <div>
            <ListItem className={classes.ListItem}>
              <ListItemText className={classes.listItemText}>
                Enter number of tokens to withdraw from the unstaked deposit
                <CustomizedTooltips classes="" content="minimumDeposit" />
              </ListItemText>
              <div>
                <TextField
                  margin="normal"
                  onChange={this.handleAmount()}
                  autoFocus
                />
              </div>
            </ListItem>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary" disabled={loading}>
            Cancel
          </Button>
          <div className={classes.submitWrapper}>
            <Button
              onClick={this.handleWithdraw()}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Withdraw
            </Button>
            {loading && <CircularProgress size={24} className={classes.submitButtonProgress} />}
          </div>
        </DialogActions>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={this.handleSnackbarClose()}
        />
      </Dialog>
    );
  }
}

WithdrawBox.propTypes = {
  open: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  listing: PropTypes.instanceOf(ListingItem),
};

WithdrawBox.defaultProps = {
  open: false,
  handleCancel: () => {},
  handleSuccess: () => {},
  listing: [],
};

export default withStyles(styles)(WithdrawBox);
