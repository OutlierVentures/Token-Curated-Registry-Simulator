const Web3 = require('web3');

const results = [];

const callback = function callback(error, result) {
  if (error) {
    throw new Error(error.toString());
  } else {
    results.push(result);
  }
};

function portToAddr(port) {
  return `http://localhost:${port}`;
}

export default class TcrConnection {
  constructor(portNum, contractAddr, contractAbi) { // eslint-disable-line no-unused-vars
    this.web3 = new Web3(new Web3.providers.HttpProvider(portToAddr(portNum)));
    this.web3.eth.net.isListening(() => {
      // TODO: uncomment when ready to integrate with deployed contracts.
      if (!this.web3.utils.isAddress(contractAddr)) {
        // throw new Error('Invalid contract address');
      }
      // this.contract = this.web3.eth.contract(contractAbi).at(contractAddr);
    });
  }

  submit(initiator, submissionQuality, submissionFrequency) {
    this.contract.submit.call(initiator, submissionQuality, submissionFrequency, callback);
  }

  vote(initiator, submission, accept) {
    this.contract.vote.call(initiator, submission, accept, callback);
  }

  getPendingList() {
    return this.contract.getPendingList.call();
  }

  /**
   * Get the balance of an address.
   * @param  {string} address - Address to get the balance of, with the format '0x...'
   * @return {number} Balance of the address in wei.
   */
  async getBalance(address) {
    if (!this.web3.utils.isAddress(address)) {
      throw new Error('Invalid address');
    }
    const balance = await this.web3.eth.getBalance(address);
    return Number(balance);
  }
}
