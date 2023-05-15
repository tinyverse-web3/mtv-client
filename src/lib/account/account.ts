import { MtvCrypto } from './crypto';
import { MtvStorage } from './storage';
import { Keystore, Password } from './wallet';
import { Shamir } from '@/lib/account';
import { ethers } from 'ethers';
import { KeySha } from './kvSha';
import EthCrypto from 'eth-crypto';
import CryptoJS from 'crypto-js';

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
const LOCAL_ACCOUNT_KEY = 'account';

interface Guardian {
  name: string;
  type: string;
  id?: string;
}
interface NostrInfo {
  pk: string;
  sk: string;
}
export interface AccountInfo {
  publicKey: string;
  avatar: string;
  name: string;
  address: string;
  safeLevel: number;
  bindStatus: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  privacyInfo: {};
  nostr: NostrInfo;
  guardians: Guardian[];
}
export class Account {
  private readonly keystore = new Keystore();
  private readonly password = new Password();
  private readonly sss = new Shamir();
  private crypto?: MtvCrypto;
  private mtvStorage?: MtvStorage;
  public keySha?: KeySha;
  public privateKey?: string;
  private wallet?: ethers.HDNodeWallet;
  public accountInfo: AccountInfo = {
    publicKey: '',
    avatar: '',
    name: '',
    address: '',
    safeLevel: 0,
    bindStatus: false,
    maintainPhrase: false,
    maintainProtector: false,
    maintainQuestion: false,
    privacyInfo: {},
    nostr: {
      pk: '',
      sk: '',
    },
    guardians: [],
  };

  /**
   * 创建加密实例
   * @param {any} privateKey:string
   * @returns {any}
   */
  private initCrypto(privateKey: string) {
    this.crypto = new MtvCrypto(privateKey);
  }
  /**
   * 创建加密实例
   * @param {any} privateKey:string
   * @returns {any}
   */
  private initKeySha(publicKey: string) {
    this.keySha = new KeySha(publicKey);
  }
  /**
   * 创建存储实例
   * @param {any} privateKey:string
   * @returns {any}
   */
  private async initMtvStorage(privateKey: string) {
    if (this.crypto === undefined) {
      console.error('crypto is undefined');
    } else {
      try {
        this.mtvStorage = new MtvStorage(privateKey, this.crypto);
        await this.mtvStorage.init();
        console.log('创建 mtv storage 成功');
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 创建各种实例
   * @param {any} password:string
   * @returns {any}
   */
  async create(password: string) {
    this.wallet = ethers.Wallet.createRandom();
    await this.exposed();
    await this.saveKeyStore(password);
    try {
      if (this.privateKey) {
        await this.initCrypto(this.privateKey);
        await this.initKeySha(this.accountInfo.publicKey);
        await this.initMtvStorage(this.privateKey);
      } else {
        console.log('不存在 private key');
      }
    } catch (error) {
      console.error('存储模块创建失败');
      console.error(error);
    }
  }

  /**
   * 恢复账号数据
   * @returns {any}
   */
  async restore() {
    try {
      await this.mtvStorage?.resume();
      const serverAccount = this.mtvStorage?.get(LOCAL_ACCOUNT_KEY);
      if (serverAccount) {
        this.accountInfo = { ...this.accountInfo, ...serverAccount };
      }
    } catch (error: any) {
      if (error.toString().indexOf('resolve name') > -1) {
        console.error('您未备份过数据，数据无法恢复！');
      } else {
        console.error('恢复数据失败，请重试！');
      }
    }
  }
  async saveAccount() {
    await this.mtvStorage?.put(LOCAL_ACCOUNT_KEY, this.accountInfo);
  }
  /**
   * Description
   * @returns {any}
   */
  private async encryptPrivateKey() {
    const { privateKey } = this.wallet || {};
    if (privateKey) {
      return CryptoJS.SHA256(privateKey).toString();
    }
    return undefined;
  }
  /**
   * 获取助记词
   * @returns {string} 助记词
   */
  public getMnemonic() {
    return this.wallet?.mnemonic?.phrase;
  }
  /**
   * 暴露公私钥和地址
   */
  private async exposed() {
    const { publicKey = '', address = '' } = this.wallet || {};
    this.accountInfo.publicKey = publicKey;
    this.privateKey = await this.encryptPrivateKey();
    this.accountInfo.address = address;
  }

  /**
   * 通过密码保存 keystore
   * @param {string} password:string
   * @returns {any}
   */
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
