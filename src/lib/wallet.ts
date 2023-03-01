import { ethers } from 'ethers';
import md5 from 'md5';
import { Storage } from './storage';
import keystoreIdb  from 'keystore-idb';

export enum STATUS_CODE {
  EMPTY_PASSWORD,
  INVALID_PASSWORD,
  EMPTY_KEYSTORE,
  SUCCESS,
}
const LOCAL_PASSWORD_KEY = '_keypassword';
export class Wallet {
  private storage: Record<string, Storage>;
  private keystore?: string;
  public wallet?: ethers.HDNodeWallet;

  constructor() {
    this.storage = {
      keystore: new Storage('_keystore'),
    };
  }
  async createWallet(password: string) {
    this.wallet = ethers.Wallet.createRandom();
    await this.createKeystore(password);
  }
  getMnemonic() {
    return this.wallet?.mnemonic?.phrase;
  }
  async restoreFromKey(key: string, password: string) {
    const mnemonic = ethers.Mnemonic.fromEntropy(key);
    this.wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
    await this.createKeystore(password);
    return STATUS_CODE.SUCCESS;
  }
  async restoreWallet(phrase: string, password: string) {
    this.wallet = ethers.HDNodeWallet.fromPhrase(phrase);
    await this.createKeystore(password);
    return STATUS_CODE.SUCCESS;
  }
  async createKeystore(password: string) {
    const encryptPwd = md5(password);
    sessionStorage.setItem(LOCAL_PASSWORD_KEY, encryptPwd);
    if (this.wallet) {
      await keystoreIdb.clear();

      const ks1 = await keystoreIdb.init({
        storeName: '_keystore',
        symmLen: 256,
        symmAlg: keystoreIdb.SymmAlg.AES_GCM,
      });
      const keystore = await this.wallet.encrypt(encryptPwd);
      this.keystore = keystore;
      this.storage.keystore.set(keystore);
    }
  }
  async verify(password: string) {
    const encryptPwd = md5(password);
    return await this._verify(encryptPwd);
  }
  async _verify(encryptPwd: string) {
    try {
      this.wallet = (await ethers.Wallet.fromEncryptedJson(
        this.keystore as string,
        encryptPwd,
      )) as ethers.HDNodeWallet;
      sessionStorage.setItem(LOCAL_PASSWORD_KEY, encryptPwd);
      return STATUS_CODE.SUCCESS;
    } catch (error) {
      if ((error as any).code == 'INVALID_ARGUMENT') {
        return STATUS_CODE.INVALID_PASSWORD;
      }
    }
  }
  async refresh() {
    this.keystore = await this.storage.keystore.get();
  }
  async checkKeystore() {}
  async check() {
    await this.refresh();
    if (!this.keystore) {
      return STATUS_CODE.EMPTY_KEYSTORE;
    }
    const localPassword = sessionStorage.getItem(LOCAL_PASSWORD_KEY);
    if (!localPassword) {
      return STATUS_CODE.EMPTY_PASSWORD;
    }
    return this._verify(localPassword);
  }
}

export default new Wallet();
