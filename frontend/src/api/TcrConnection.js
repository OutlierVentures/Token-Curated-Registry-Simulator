import { getContractInfo } from '../config';
import ListingItem from './ListingItem';
import Poll from './Poll';
import VotingConnection from './VotingConnection';

export default class TcrConnection {
  constructor(contract, voting) {
    this.contract = contract;
    this.voting = voting;
  }

  static async create(address, votingAddress) {
    if (!window.web3.isAddress(address)) {
      throw new Error('Invalid contract address');
    }
    if (!window.web3.isAddress(votingAddress)) {
      throw new Error('Invalid voting contract address');
    }

    const registryAbi = (await getContractInfo('Registry')).abi;
    const contract = window.web3.eth.contract(registryAbi).at(address);
    const voting = await VotingConnection.create(votingAddress);
    return new TcrConnection(contract, voting);
  }

  async _callRegistryMethod(method, ...args) {
    console.log(`Calling ${method}(${args.join(', ')})`); // eslint-disable-line no-console
    return new Promise((resolve, reject) => {
      this.contract[method](...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Submit Action
  async submit(deposit, listing) {
    return this._callRegistryMethod('apply', listing.getHash(), deposit, listing.toString());
  }

  // Challenge Action
  async challenge(listingHash, description) {
    return this._callRegistryMethod('challenge', listingHash, description);
  }

  // Withdraw Action
  async withdraw(listingHash, amount) {
    return this._callRegistryMethod('withdraw', listingHash, amount);
  }

  // Poke submission into registry by getting updates after application period passes
  async updateStatus(listingHash) {
    return this._callRegistryMethod('updateStatus', listingHash);
  }

  async getAllListings() {
    const applications = await this.getAllApplications();
    const whitelisted = await this.getEventListingHashes('_ApplicationWhitelisted');
    const rejected = await this.getEventListingHashes('_ApplicationRemoved');
    const challenges = await this.getAllEvents('_Challenge');

    challenges.forEach(({ args }) => {
      const listing = applications.find(({ listingHash }) => listingHash === args.listingHash);
      listing.challengePoll = Poll.fromObject(args);
      listing.status = 'InChallenge';
    });

    whitelisted.forEach((whitelistedHash) => {
      const listing = applications.find(({ listingHash }) => listingHash === whitelistedHash);
      listing.status = 'Accepted';
    });

    rejected.forEach((rejectedHash) => {
      const listing = applications.find(({ listingHash }) => listingHash === rejectedHash);
      listing.status = 'Rejected';
    });

    return applications;
  }

  async getInChallengeListings() {
    const pastApplicationList = await this.getAllApplications();
    const challengeEvents = await this.getAllEvents('_Challenge');
    const inChallenge = [];
    pastApplicationList.forEach((listing) => {
      const challenge = challengeEvents.find(evt => evt.args.listingHash === listing.listingHash);
      if (challenge) {
        listing.challengePoll = Poll.fromObject(challenge.args);
        inChallenge.push(listing);
      }
    });
    return inChallenge;
  }

  async getInChallengeListingHashes() {
    return this.getEventListingHashes('_Challenge');
  }

  async getEventListingHashes(eventName) {
    const events = await this.getAllEvents(eventName);
    return events.map(event => event.args.listingHash);
  }

  async getAllApplications() {
    const events = await this.getAllEvents('_Application');
    return events.map(event => ListingItem.fromObject(event.args));
  }

  async getAllEvents(name) {
    return new Promise((resolve, reject) => {
      this.contract[name]({}, { fromBlock: 0, toBlock: 'latest' }).get((error, events) => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
          reject(error);
        } else {
          resolve(events);
        }
      });
    });
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
