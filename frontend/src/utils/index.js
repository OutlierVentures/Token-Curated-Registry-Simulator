import crypto from 'crypto';

export const generateSalt = () => Buffer.from(crypto.randomBytes(16)).readUInt32BE(0);

export const bigNumber2Date = bigNum => new Date(bigNum.toNumber() * 1000);

const callWeb3Method = async (web3, func, ...args) => (
  new Promise((resolve, reject) => {
    web3[func](...args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
);

export const getCurrentTime = async () => {
  const blockNumber = await callWeb3Method(window.web3.eth, 'getBlockNumber');
  const block = await callWeb3Method(window.web3.eth, 'getBlock', blockNumber);
  return new Date(block.timestamp * 1000);
};

window.cryptoo = crypto;
