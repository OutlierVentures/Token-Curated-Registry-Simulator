import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { generateSalt } from './utils';
import VotingConnection from './api/VotingConnection';
import Poll from './api/Poll';

const styles = theme => ({
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

class CommitVoteDialog extends React.Component {
  state = {
    loading: false,
    snackbarOpen: false,
    snackbarMessage: '',
    voteOption: null,
    salt: generateSalt(),
    tokensToCommit: 0,
  };

  handleCancel = () => () => {
    const { handleCancel } = this.props;
    this.setState({ voteOption: null, salt: generateSalt() });
    handleCancel();
  }

  handleCommit = () => async () => {
    const { handleCommit, votingConnection, poll } = this.props;
    const { voteOption, salt, tokensToCommit } = this.state;
    const option = voteOption === 'accept' ? 1 : 0;
    this.setState({ loading: true });
    try {
      await votingConnection.commitVote(poll.id, Number(tokensToCommit), option, salt);
      handleCommit();
    } catch (e) {
      this.setState({ snackbarOpen: true, snackbarMessage: e.toString() });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleTokensToCommitChange = event => this.setState({ tokensToCommit: event.target.value });

  handleSnackbarClose = () => () => {
    this.setState({ snackbarOpen: false });
  }

  handleVoteOption = (event, voteOption) => this.setState({ voteOption });

  render() {
    const { classes, open, poll } = this.props;
    const {
      loading,
      snackbarOpen,
      snackbarMessage,
      voteOption,
      salt,
      tokensToCommit,
    } = this.state;
    const { commitEndDate } = poll;

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel()}
        aria-labelledby="form-dialog-title"
        className={classes.dialogBox}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Commit Vote
        </DialogTitle>
        <DialogContent>
          <Typography variant="p"><strong>Commit period ends:</strong></Typography>
          <Typography variant="p" paragraph>{commitEndDate.toString()}</Typography>

          <Typography variant="p"><strong>Tokens to commit:</strong></Typography>
          <Input
            value={tokensToCommit}
            onChange={this.handleTokensToCommitChange}
            endAdornment={<InputAdornment position="end">TST</InputAdornment>}
          />

          <Typography variant="p"><strong>Option:</strong></Typography>
          <RadioGroup value={voteOption} onChange={this.handleVoteOption}>
            <FormControlLabel
              value="accept"
              control={<Radio color="primary" />}
              label="Accept application"
            />
            <FormControlLabel
              value="reject"
              control={<Radio color="primary" />}
              label="Reject application"
            />
          </RadioGroup>

          <Typography variant="p"><strong>Vote details:</strong></Typography>
          {voteOption ? (
            <div>
              <Typography variant="p" color="textSecondary" paragraph>
                <em>
                  Remember to copy this and store safely -
                  you&quot;ll need it to reveal your vote!
                </em>
              </Typography>
              <Card>
                <CardContent>
                  <pre>
                    {JSON.stringify({ voteOption, salt }, null, ' ')}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Typography variant="p" color="textSecondary" paragraph>
              <em>Please select an option first.</em>
            </Typography>
          )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel()} color="primary" disabled={loading}>
            Cancel
          </Button>
          <div className={classes.submitWrapper}>
            <Button
              onClick={this.handleCommit()}
              variant="contained"
              color="primary"
              disabled={!voteOption || loading}
            >
              Submit vote
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

CommitVoteDialog.propTypes = {
  open: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleCommit: PropTypes.func,
  poll: PropTypes.instanceOf(Poll).isRequired,
  votingConnection: PropTypes.instanceOf(VotingConnection).isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

CommitVoteDialog.defaultProps = {
  open: false,
  handleCancel: () => {},
  handleCommit: () => {},
};

export default withStyles(styles)(CommitVoteDialog);
