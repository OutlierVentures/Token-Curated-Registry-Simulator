/* global artifacts */

const TestToken = artifacts.require('./TestToken.sol');

module.exports = deployer => deployer.deploy(TestToken, { gas: 6000000 });
