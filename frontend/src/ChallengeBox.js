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

class ChallengeBox extends React.Component {
  state = {
    description: '',
    loading: false,
    snackbarOpen: false,
    snackbarMessage: '',
  };

  // handleNameChange = () => (event) => {
  //   const name = event.target.value;
  //   this.setState({ name });
  // }

  // handleChange = name => (event) => {
  //   const newParam = { [name]: event.target.value };
  //   this.setState((state) => {
  //     const parameters = Object.assign({}, state.parameters, newParam);
  //     return { parameters };
  //   });
  // };

  // handleCreate = () => async () => {
  //   const { handleCreate } = this.props;
  //   const { name, parameters } = this.state;
  //   this.setState({ loading: true });
  //   try {
  //     const newTcr = await createTcr(name, parameters || {});
  //     handleCreate(newTcr);
  //   } catch (e) {
  //     this.setState({ snackbarOpen: true, snackbarMessage: e.toString() });
  //   } finally {
  //     this.setState({ loading: false });
  //   }
  // };

  handleDescription = () => (event) => {
    const description = event.target.value;
    this.setState({ description });
  }

  handleChallenge = () => async () => {
    const { handleSuccess, tcrConnection, listing } = this.props;
    const { description } = this.state;
    await tcrConnection.challenge(listing.listingHash, description);
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
          Challenge a Submission
        </DialogTitle>
        <DialogContent>
          <div>
            <ListItem className={classes.ListItem}>
              <ListItemText className={classes.listItemText}>
                Reason to Challenge
                <CustomizedTooltips classes="" content="minimumDeposit" />
              </ListItemText>
              <div>
                <TextField
                  margin="normal"
                  onChange={this.handleDescription()}
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
              onClick={this.handleChallenge()}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Challenge
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

ChallengeBox.propTypes = {
  open: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  listing: PropTypes.instanceOf(ListingItem),
};

ChallengeBox.defaultProps = {
  open: false,
  handleCancel: () => {},
  handleSuccess: () => {},
  listing: [],
};

export default withStyles(styles)(ChallengeBox);
