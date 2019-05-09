import crypto from 'crypto';
import { bufferToHex, privateToAddress, toBuffer } from 'ethereumjs-util';

export async function sleep(milliseconds) { // eslint-disable-line import/prefer-default-export
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function randomInRange(start, end) {
  return Math.random() * (end - start) + start;
}

export function randomIntInRange(start, end) {
  return Math.floor(randomInRange(start, end));
}

export function randomValueHex(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, len); // return required number of characters
}

export function isValidAddress(address) {
  return address.length === 42 && address.startsWith('0x');
}

export function generateSecretKey() {
  return `0x${randomValueHex(64)}`;
}

/**
 * Converts a private key to its corresponding address.
 * @param  {string} privateKey - The given private key as a hex string i.e. '0x...'
 * @return {string} Ethereum address of the private key, as a hex string i.e. '0x...'
 */
export function privateToAddressHex(privateKey) {
  return bufferToHex(privateToAddress(toBuffer(privateKey)));
}
