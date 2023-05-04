import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';
import { Shamir } from '@/lib/account';
import { Storage } from '../storage';
import CryptoJS from 'crypto-js';

console.log(ethers);
export enum STATUS_CODE {
  EMPTY_PASSWORD,
  INVALID_PASSWORD,
  EMPTY_KEYSTORE,
  SUCCESS,
  RESTORE_ERROR,
  SHARES_ERROR,
}
const LOCAL_PASSWORD_KEY = '_password';
const LOCAL_PASSWORD_SALT_KEY = '_password_salt';
const LOCAL_KEYSTORE_KEY = '_keystore';

class Keystore {
  private storage: Record<string, Storage>;
  constructor() {
    this.storage = {
      keystore: new Storage(LOCAL_KEYSTORE_KEY),
    };
  }
  async create(privateKey: string, password: string) {
    sessionStorage.setItem(LOCAL_PASSWORD_KEY, password);
    const encrypted = await this.encrypt(privateKey, password);
    await this.storage.keystore.set(encrypted);
  }
  async encrypt(data: string, password: string) {
    const key = CryptoJS.enc.Base64.parse(password);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return {
      iv: encrypted.iv.toString(CryptoJS.enc.Hex),
      content: encrypted.toString(),
    };
  }
  async decrypt(password: string) {
    const encrypted = await this.storage.keystore.get();
    if (!encrypted) {
      return;
    }
    const key = CryptoJS.enc.Base64.parse(password);
    const decipher = CryptoJS.AES.decrypt(encrypted.content, key, {
      iv: CryptoJS.enc.Hex.parse(encrypted.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decipher.toString(CryptoJS.enc.Utf8);
  }
  async get(password: string) {
    return await this.decrypt(password);
  }
  async exist() {
    return !!(await this.storage.keystore.get());
  }
  async remove() {
    await this.storage.keystore.remove();
  }
}

export class Password {
  private saltStorage: Storage;
  constructor() {
    this.saltStorage = new Storage(LOCAL_PASSWORD_SALT_KEY);
  }
  async set(password: string) {
    const encryptPwd = await this.encrypt(password);
    sessionStorage.setItem(LOCAL_PASSWORD_KEY, encryptPwd);
    return encryptPwd;
  }
  async encrypt(password: string) {
    const salt = await this.getSalt();
    const encryptPwd = CryptoJS.PBKDF2(password, salt.toString(), {
      keySize: 256 / 32,
    });
    const encryptPwdString = encryptPwd.toString();
    return encryptPwdString;
  }
  async getSalt() {
    const localSalt = await this.saltStorage.get();
    if (localSalt) {
      return localSalt;
    } else {
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const saltString = salt.toString();
      await this.saltStorage.set(saltString);
      return saltString;
    }
  }
  async get() {
    return sessionStorage.getItem(LOCAL_PASSWORD_KEY);
  }
  async remove() {
    sessionStorage.removeItem(LOCAL_PASSWORD_KEY);
  }
  async removeSalt() {
    await this.saltStorage.remove();
  }
}
export class Wallet {
  private readonly keystore = new Keystore();
  private readonly password = new Password();
  private readonly sss = new Shamir();
  public publicKey?: string;
  public privateKey?: string;
  public address?: string;
  public wallet?: ethers.HDNodeWallet;
  constructor() {}

  getMnemonic() {
    return this.wallet?.mnemonic?.phrase;
  }
  async encryptPrivateKey() {
    const { privateKey } = this.wallet || {};
    if (privateKey) {
      return CryptoJS.SHA256(privateKey).toString();
    }
    return undefined;
  }
  private async exposed() {
    const { publicKey, address } = this.wallet || {};
    this.publicKey = publicKey;
    this.privateKey = await this.encryptPrivateKey();
    this.address = address;
  }
  async create(password: string) {
    this.wallet = ethers.Wallet.createRandom();
    await this.exposed();
    await this.saveKeyStore(password);
  }
  async saveKeyStore(password: string) {
    const encryptPwd = await this.password.set(password);
    const { entropy } = this.wallet?.mnemonic || {};
    if (entropy) {
      await this.keystore.create(entropy, encryptPwd);
    }
  }
  async restoreFromEntropy(entropy: string, password: string) {
    const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
    this.wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
    await this.saveKeyStore(password);
    await this.exposed();
    return STATUS_CODE.SUCCESS;
  }
  async restoreFromPhrase(phrase: string, password: string) {
    this.wallet = ethers.HDNodeWallet.fromPhrase(phrase);
    await this.saveKeyStore(password);
    await this.exposed();
    return STATUS_CODE.SUCCESS;
  }
  async delete() {
    await this.keystore.remove();
    await this.password.remove();
    await this.password.removeSalt();
  }
  async changePwd(oldPwd: string, newPwd: string) {
    const status = await this.verify(oldPwd);
    if (status === STATUS_CODE.SUCCESS && this.wallet) {
      await this.password.removeSalt();
      const encryptPwd = await this.password.set(newPwd);
      console.log('新密码hash', encryptPwd);
      const { entropy } = this.wallet.mnemonic || {};
      if (entropy) {
        await this.keystore.create(entropy, encryptPwd);
      }
    }
  }
  async changeHashPwd(oldPwd: string, newPwd: string) {
    const status = await this.verfiyHashPwd(oldPwd);
    if (status === STATUS_CODE.SUCCESS && this.wallet) {
      await this.password.removeSalt();
      const encryptPwd = await this.password.set(newPwd);
      const { entropy } = this.wallet.mnemonic || {};
      if (entropy) {
        await this.keystore.create(entropy, encryptPwd);
      }
    }
  }

  private async _verify(encryptPwd: string) {
    try {
      const keystore = await this.keystore.get(encryptPwd);
      if (keystore) {
        const mnemonic = ethers.Mnemonic.fromEntropy(keystore);
        this.wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
        await this.exposed();
        sessionStorage.setItem(LOCAL_PASSWORD_KEY, encryptPwd);
        return STATUS_CODE.SUCCESS;
      } else {
        return STATUS_CODE.INVALID_PASSWORD;
      }
    } catch (error) {
      console.log(error);
      return STATUS_CODE.INVALID_PASSWORD;
    }
  }

  async verify(password: string) {
    const entropyPwd = await this.password.encrypt(password);
    console.log(entropyPwd);
    return await this._verify(entropyPwd);
  }
  async verfiyHashPwd(pwd: string) {
    return await this._verify(pwd);
  }

  async check() {
    const keystore = await this.keystore.exist();
    if (!keystore) {
      return STATUS_CODE.EMPTY_KEYSTORE;
    }
    const password = await this.password.get();
    if (!password) {
      return STATUS_CODE.EMPTY_PASSWORD;
    }
    return this._verify(password);
  }
  async sssSplit(account = 3, threshold = 2) {
    if (this.wallet) {
      const { entropy } = this.wallet?.mnemonic || {};
      if (entropy) {
        const splitShares: any[] = await this.sss.split(
          entropy,
          threshold,
          account,
        );
        const hexShares = splitShares.map((s) => s.toString('hex'));
        return hexShares;
      }
    }
  }
  async sssResotre(shares: string[], password: string, threshold = 2) {
    const sliceShares = shares.slice(0, threshold);
    if (sliceShares.length === 2) {
      try {
        const combineKey = await this.sss.combine(sliceShares);
        return await this.restoreFromEntropy(combineKey, password);
      } catch (error) {
        return STATUS_CODE.SHARES_ERROR;
      }
    } else {
      return STATUS_CODE.SHARES_ERROR;
    }
  }
  async sign(message: string) {
    if (this.wallet) {
      const { privateKey, address } = this.wallet;
      const signHash = ethers.solidityPackedKeccak256(
        ['address', 'string'],
        [address, message.toString()],
      );
      const signMessage = EthCrypto.sign(privateKey, signHash);
      return signMessage;
    }
  }
  async signMessage(message: string) {
    if (this.wallet) {
      return this.wallet.signMessage(message.toString());
    }
  }
}

export default new Wallet();
