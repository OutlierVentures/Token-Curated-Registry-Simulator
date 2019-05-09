import { getToken } from '../config';

export default class TokenService {
  constructor() {
    this.web3 = null;
    this.token = null;
  }

  async init(web3) {
    this.web3 = web3;
    this.token = await getToken(this.web3);
    window.token = this;
  }

  async balanceOf(account) {
    return new Promise((resolve, reject) => {
      this.token.balanceOf(account, (error, tx) => {
        if (error) {
          reject(error);
        }
        resolve(tx);
      });
    });
  }

  async currentAccountBalance() {
    return new Promise((resolve, reject) => {
      this.token.currentAccountBalance((error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async sendToken(value) {
    return new Promise((resolve, reject) => {
      this.token.sendToken(value, (error, tx) => {
        if (error) {
          reject(error);
        }
        resolve(tx);
      });
    });
  }
}
