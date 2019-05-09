import React from 'react';
import Typography from '@material-ui/core/Typography';
import TokenService from '../api/TokenService';

export default class TokenBalance extends React.Component {
  tokenService = new TokenService();

  state = {
    balance: 0,
  }

  componentDidMount = async () => {
    await this.tokenService.init(window.web3);
    await this.refreshBalance();
    const self = this;
    const address = window.web3.eth.defaultAccount;
    const transferEvent = this.tokenService.token.Transfer({ _from: address, _to: address });
    transferEvent.watch(async (error) => {
      if (!error) {
        await self.refreshBalance();
      } else {
        console.log(error); // eslint-disable-line no-console
      }
    });
  }

  refreshBalance = async () => {
    const newBalance = await this.tokenService.currentAccountBalance();
    this.setState({ balance: newBalance });
  }

  onClick = () => async () => {
    await this.tokenService.sendToken(500);
  }

  render() {
    const { balance } = this.state;
    // console.log(await tokenService.currentAccountBalance());
    return (
      <Typography variant="h6" color="inherit" onClick={this.onClick()}>
        Balance =
        {' '}
        {balance.toString()}
      </Typography>
    );
  }
}

TokenBalance.propTypes = {
};
