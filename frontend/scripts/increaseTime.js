/* eslint-disable no-console */

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

function providerSend(provider, method, ...params) {
  console.log(`Calling ${method}(${params.join(', ')})`);
  provider.send({
    method,
    params,
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
}

function increaseTime(time) {
  providerSend(web3.currentProvider, 'evm_increaseTime', time);
  providerSend(web3.currentProvider, 'evm_mine');
}

const hours = Number(process.argv[2]);
const seconds = hours * 60 * 60;

if (process.argv.length !== 3) {
  console.error('Usage: node increaseTime.js [hours]');
  process.exit(1);
}

if (Number.isNaN(hours)) {
  console.error(`${process.argv[2]} is not a number.`);
  process.exit(1);
}

console.log(`Increasing time by ${hours} hours (${seconds} seconds)`);
increaseTime(seconds);
