/* eslint-env mocha */
/* global assert contract */
const fs = require('fs');
const BN = require('bignumber.js');

const config = JSON.parse(fs.readFileSync('./conf/config.json'));
const paramConfig = config.paramDefaults;

const utils = require('../utils.js');

const bigTen = number => new BN(number.toString(10), 10);

contract('Registry', (accounts) => {
  describe('Function: claimReward', () => {
    const [applicant, challenger, voterAlice] = accounts;
    const minDeposit = bigTen(paramConfig.minDeposit);

    let token;
    let voting;
    let registry;

    beforeEach(async () => {
      const { votingProxy, registryProxy, tokenInstance } = await utils.getProxies();
      voting = votingProxy;
      registry = registryProxy;
      token = tokenInstance;

      await utils.approveProxies(accounts, token, voting, false, registry);
    });

    it('should transfer the correct number of tokens once a challenge has been resolved', async () => {
      const listing = utils.getListingHash('claimthis.net');

      // Apply
      await utils.as(applicant, registry.apply, listing, minDeposit, '');
      const aliceStartingBalance = await token.balanceOf.call(voterAlice);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing, challenger, registry);

      // Alice is so committed
      await utils.commitVote(pollID, '0', 500, '420', voterAlice, voting);
      await utils.increaseTime(paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await utils.as(voterAlice, voting.revealVote, pollID, '0', '420');
      await utils.increaseTime(paramConfig.revealStageLength + 1);

      // Update status
      await utils.as(applicant, registry.updateStatus, listing);

      // Alice claims reward
      const aliceVoterReward = await registry.voterReward(voterAlice, pollID);
      await utils.as(voterAlice, registry.claimReward, pollID);

      // Alice withdraws her voting rights
      await utils.as(voterAlice, voting.withdrawVotingRights, '500');

      const aliceExpected = aliceStartingBalance.add(aliceVoterReward);
      const aliceFinalBalance = await token.balanceOf.call(voterAlice);

      assert.strictEqual(
        aliceFinalBalance.toString(10), aliceExpected.toString(10),
        'alice should have the same balance as she started',
      );
    });

    it('should revert if challenge does not exist', async () => {
      const listing = utils.getListingHash('reversion.net');
      await utils.addToWhitelist(listing, minDeposit, applicant, registry);

      try {
        const nonPollID = '666';
        await utils.as(voterAlice, registry.claimReward, nonPollID);
        assert(false, 'should not have been able to claimReward for non-existant challengeID');
      } catch (err) {
        assert(utils.isEVMException(err), err.toString());
      }
    });

    it('should not transfer tokens if msg.sender has already claimed tokens for a challenge', async () => {
      const listing = utils.getListingHash('sugar.net');

      const applicantStartingBalance = await token.balanceOf.call(applicant);
      const aliceStartingBalance = await token.balanceOf.call(voterAlice);

      await utils.addToWhitelist(listing, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing, challenger, registry);

      // Alice is so committed
      await utils.commitVote(pollID, '0', 500, '420', voterAlice, voting);
      await utils.increaseTime(paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await utils.as(voterAlice, voting.revealVote, pollID, '0', '420');
      await utils.increaseTime(paramConfig.revealStageLength + 1);

      // Update status
      await utils.as(applicant, registry.updateStatus, listing);

      // Claim reward
      await utils.as(voterAlice, registry.claimReward, pollID);

      try {
        await utils.as(voterAlice, registry.claimReward, pollID);
        assert(false, 'should not have been able to call claimReward twice');
      } catch (err) {
        assert(utils.isEVMException(err), err.toString());
      }

      const applicantEndingBalance = await token.balanceOf.call(applicant);
      const appExpected = applicantStartingBalance.sub(minDeposit);

      const aliceEndingBalance = await token.balanceOf.call(voterAlice);
      const aliceExpected = aliceStartingBalance.add(minDeposit.div(bigTen(2))).sub(bigTen(500));

      assert.strictEqual(
        applicantEndingBalance.toString(10), appExpected.toString(10),
        'applicants ending balance is incorrect',
      );
      assert.strictEqual(
        aliceEndingBalance.toString(10), aliceExpected.toString(10),
        'alices ending balance is incorrect',
      );
    });

    it('should not transfer tokens for an unresolved challenge', async () => {
      const listing = utils.getListingHash('unresolved.net');

      const applicantStartingBalance = await token.balanceOf.call(applicant);
      const aliceStartingBalance = await token.balanceOf.call(voterAlice);

      await utils.addToWhitelist(listing, minDeposit, applicant, registry);

      // Challenge
      const pollID = await utils.challengeAndGetPollID(listing, challenger, registry);

      // Alice is so committed
      await utils.commitVote(pollID, '0', 500, '420', voterAlice, voting);
      await utils.increaseTime(paramConfig.commitStageLength + 1);

      // Alice is so revealing
      await utils.as(voterAlice, voting.revealVote, pollID, '0', '420');
      await utils.increaseTime(paramConfig.revealStageLength + 1);

      try {
        await utils.as(voterAlice, registry.claimReward, pollID);
        assert(false, 'should not have been able to claimReward for unresolved challenge');
      } catch (err) {
        assert(utils.isEVMException(err), err.toString());
      }

      const applicantEndingBalance = await token.balanceOf.call(applicant);
      const appExpected = applicantStartingBalance.sub(minDeposit);

      const aliceEndingBalance = await token.balanceOf.call(voterAlice);
      const aliceExpected = aliceStartingBalance.sub(bigTen(500));

      assert.strictEqual(
        applicantEndingBalance.toString(10), appExpected.toString(10),
        'applicants ending balance is incorrect',
      );
      assert.strictEqual(
        aliceEndingBalance.toString(10), aliceExpected.toString(10),
        'alices ending balance is incorrect',
      );
    });
  });
});

