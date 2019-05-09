import abi from 'ethereumjs-abi';
import { getVotingContractAt } from '../config';

export default class VotingConnection {
  constructor(voting) {
    this.voting = voting;
  }

  static async create(contractAddress) {
    const voting = await getVotingContractAt(contractAddress);
    return new VotingConnection(voting);
  }

  async commitVote(pollId, numTokens, voteOption, voteSalt) {
    const secretHash = abi.soliditySHA3(
      ['uint', 'uint'],
      [voteOption, voteSalt],
    ).toString('hex');
    const voterAddr = window.web3.eth.defaultAccount;
    const prevPollID = await this._callVotingMethod(
      'getInsertPointForNumTokens', voterAddr, numTokens, pollId,
    );
    await this._callVotingMethod('commitVote', pollId, `0x${secretHash}`, numTokens, prevPollID);
  }

  async revealVote(pollId, voteOption, voteSalt) {
    await this._callVotingMethod('revealVote', pollId, voteOption, voteSalt);
  }

  async _callVotingMethod(method, ...args) {
    console.log(`Calling ${method}(${args.join(', ')})`); // eslint-disable-line no-console
    return new Promise((resolve, reject) => {
      this.voting[method](...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
