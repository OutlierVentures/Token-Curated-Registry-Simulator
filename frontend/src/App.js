import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import UserProfile from './UserProfile';
import Player from './Player';
import Admin from './admin/Admin';

const styles = {

};

class App extends React.Component {
  componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // Request account access if needed
      window.ethereum.enable()
        .then(() => { [window.web3.eth.defaultAccount] = window.web3.eth.accounts; })
        .catch(e => console.error(e)); // eslint-disable-line no-console
    } else if (window.web3) {
      // Legacy dapp browsers...
      window.web3 = new Web3(window.web3.currentProvider);
      [window.web3.eth.defaultAccount] = window.web3.eth.accounts;
    } else {
      // Non-dapp browsers...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!'); // eslint-disable-line no-console
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Player} />
          <Route path="/player" component={Player} />
          <Route path="/admin" component={Admin} />
          <Route path="/profile" component={UserProfile} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
