import * as Web3Storage from '@tinyverse.space/web3storage';
export class MtvStorage {
  private readonly userPk: string;
  private ipfsStorage: any;
  private crypto: any;
  constructor(userPk: string, crypto: any) {
    this.userPk = userPk;
    this.crypto = crypto;
  }
  async init(callback?: (ipnsId: string) => void) {
    console.log('init');
    this.ipfsStorage = await Web3Storage.createIpfsStorage(this.userPk, {
      remoteGenKeyCallback: (ipnsId: any) => {
        console.info('ipnsId: %s', ipnsId);
        callback && callback(ipnsId);
      },
      genRemoteKeyTimeout: 30000,
      syncTryTimeout: 30000,
    });
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
  async resume(ipns: string) {
    if (!this.ipfsStorage) {
      await this.ipfsStorage.resume(ipns);
    }
  }
  async destory() {
    if (this.ipfsStorage) {
      await this.ipfsStorage.stop();
    }
  }
}
