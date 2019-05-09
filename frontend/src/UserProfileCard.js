import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

const styles = {
  root: {
    padding: 8 * 3,
  },
  card: {
    width: '100%',
  },
  row: {
    display: 'flex',
  },
  avatar: {
    width: 90,
    height: 90,
    margin: 10,
  },
  details: {
    margin: '10px',
  },
};

class UserProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountID: 8349573,
      balance: 9.765,
      userName: 'John Doe',
    };
  }

  render() {
    const { classes } = this.props;
    const { accountID, balance, userName } = this.state;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent>
            <div className={classes.row}>
              <Avatar
              /* eslint-disable global-require */
                src={require('./user_profile.png')}
              /* eslint-enable global-require */
                className={classes.avatar}
              />
              <div className={classes.details}>
                <Typography variant="h6" component="h2">
                  {userName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {' '}
                  {' '}
Account ID:
                  {accountID}
                  {' '}
                  {' '}
                </Typography>
                <Typography color="textSecondary">
                  {' '}
                  {' '}
Account Balance:
                  {balance}
                  {' '}
                  {' '}
                </Typography>
              </div>
            </div>
          </CardContent>
          <CardActions>
            <Button size="small">
              Edit Profile
              {' '}
              {' '}
              <Icon>edit_icon</Icon>
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
UserProfileCard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

/* eslint-enable react/no-unused-prop-types */
export default withStyles(styles)(UserProfileCard);
