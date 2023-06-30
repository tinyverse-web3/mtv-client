// const sss = require('shamirs-secret-sharing');
import * as sss from 'shamirs-secret-sharing';
// const { randomBytes } = require('crypto');
// console.log(randomBytes);
export class Shamir {
  private readonly sss;
  constructor() {
    this.sss = sss;
  }
  async split(key: string, threshold: number = 2, account: number = 3) {
    const shares = this.sss.split(key, { shares: account, threshold });
    return shares;
  }
  async combine(shares: any[]) {
    const recovered = this.sss.combine(shares);
    return recovered.toString();
  }
} 
