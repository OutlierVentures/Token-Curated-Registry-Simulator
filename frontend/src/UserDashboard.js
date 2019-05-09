import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import PendingList from './PendingList';
import RejectedList from './RejectedList';
import AcceptedList from './AcceptedList';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = {
  root: {
    padding: 8 * 3,
    marginleft: 'auto',
    marginright: 'auto',
  },
  dashboard: {
    width: '100%%',
    height: '10cm',
  },
};


class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  /* TODO: Implement a fetch function to get data for lists */

  getTabContent() {
    const { value } = this.state;

    if (value === 0) {
      //     return 'Accepted Tab';
      return (
        <div>
          <AcceptedList type="profile" />
        </div>
      );
    }
    if (value === 1) {
      // return 'Rejected Tab';
      return (
        <div>
          <RejectedList />
        </div>
      );
    }
    // return 'Pending Tab';
    return (
      <div>
        <PendingList />
      </div>
    );
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Card className={classes.dashboard}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={this.handleChange}
            >
              <Tab label="Accepted" />
              <Tab label="Rejected" />
              <Tab label="Pending" />
            </Tabs>
          </AppBar>
          <TabContainer>{this.getTabContent()}</TabContainer>
        </Card>
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
UserDashboard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

/* eslint-enable react/no-unused-prop-types */
export default withStyles(styles)(UserDashboard);
