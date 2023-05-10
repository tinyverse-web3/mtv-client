import * as Web3Storage from '@tinyverse.space/web3storage';
export class MtvStorage {
  private readonly userPk: string;
  private ipfsStorage: any;
  private crypto: any;
  constructor(userPk: string, crypto: any) {
    this.userPk = userPk;
    this.crypto = crypto;
  }
  async init() {
    this.ipfsStorage = await Web3Storage.createIpfsStorage(this.userPk, {
      genRemoteKeyTimeout: 5000,
      syncTryTimeout: 5000,
    });
    return this.ipfsStorage;
  }
  async put(key: string, data: any) {
    if (data === null || data === undefined) {
      return;
    }
    const _data = await this.crypto.encrypt(JSON.stringify(data));
    const cid = await this.ipfsStorage.put(key, _data);
    return cid;
  }
  async get(key: string) {
    const data = await this.ipfsStorage.get(key);
    let _data = data;
    if (data) {
      _data = await this.crypto.decrypt(data);
      _data = JSON.parse(_data);
    }
    return _data;
  }
  async resume() {
    console.log('ipfs resume data');
    await this.ipfsStorage?.resume();
  }
  async connect() {
    console.log('ipfs connect network');
    await this.ipfsStorage?.connectNetwork();
  }
  async destory() {
    await this.ipfsStorage?.stop();
  }
}
