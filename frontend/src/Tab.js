import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AcceptedList from './AcceptedList';
import PendingList from './PendingList';
import RejectedList from './RejectedList';
import ChallengeList from './ChallengeList';
import TcrConnection from './api/TcrConnection';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 700,
    marginTop: 20,
  },
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
    acceptedList: [],
    pendingList: [],
    inChallengeList: [],
    rejectedList: [],
  };

  componentDidUpdate = async (prevProps) => {
    const { tcr } = this.props;
    if (tcr && (!prevProps.tcr || tcr.address !== prevProps.tcr.address)) {
      const tcrConnection = await TcrConnection.create(tcr.address, tcr.votingAddress);
      const allListings = await tcrConnection.getAllListings();
      this.setState({
        tcrConnection,
        acceptedList: allListings.filter(({ status }) => status === 'Accepted'),
        pendingList: allListings.filter(({ status }) => status === 'Pending'),
        inChallengeList: allListings.filter(({ status }) => status === 'InChallenge'),
        rejectedList: allListings.filter(({ status }) => status === 'Rejected'),
      });
      window.tcrConnection = tcrConnection;
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  handleApplySuccess = (listing) => {
    this.setState(prevState => ({
      pendingList: [...prevState.pendingList, listing],
    }));
  }

  handleChallenge = (listing) => {
    this.setState(prevState => ({
      pendingList: prevState.inChallengeList.filter(l => listing.getHash() !== l.getHash()),
      inChallengeList: [...prevState.inChallengeList, listing],
    }));
  }

  handleWithdraw = (listing) => {
    this.setState(prevState => ({
      pendingList: prevState.pendingList.filter(l => listing.getHash() !== l.getHash()),
    }));
  }

  render() {
    const { classes, theme } = this.props;
    const { tcrConnection, acceptedList, pendingList, inChallengeList, rejectedList } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value} // eslint-disable-line react/destructuring-assignment
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Accepted" />
            <Tab label="Pending" />
            <Tab label="In Challenge" />
            <Tab label="Rejected" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value} // eslint-disable-line react/destructuring-assignment
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <AcceptedList listings={acceptedList} />
          </TabContainer>

          <TabContainer dir={theme.direction}>
            <PendingList
              tcrConnection={tcrConnection}
              listItems={pendingList}
              onApplySuccess={this.handleApplySuccess}
              onChallenge={this.handleChallenge}
              onWithdraw={this.handleWithdraw}
            />
          </TabContainer>

          <TabContainer dir={theme.direction}>
            <ChallengeList
              tcrConnection={tcrConnection}
              listings={inChallengeList}
            />
          </TabContainer>

          <TabContainer dir={theme.direction}>
            <RejectedList
              listings={rejectedList}
            />
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  tcr: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
