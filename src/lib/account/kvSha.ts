import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Logger } from 'tslog';
import { config } from './mpc/config';

const logger = new Logger({ name: 'KeySha' });

export class KeySha {
  private publicKey: string;
  private app: string;
  constructor(publicKey: string, app: string = 'mtv') {
    this.publicKey = publicKey;
    this.app = app;
  }
  public async get(key: string) {
    logger.debug('keySha get key:' + key);
    const aesSupplyInfo = this.generateAesSupple(JSON.stringify(key));
    const dataKey = aesSupplyInfo.key;
    const encryptShareKey = await this.getFromDauth({ key: dataKey });
    let data;
    logger.debug('keySha get data:' + encryptShareKey);
    logger.debug('keySha get dataKey:' + dataKey);

    if (encryptShareKey) {
      data = this.aesDecode(
        aesSupplyInfo.aes_key,
        aesSupplyInfo.aes_iv,
        encryptShareKey,
      );
      console.log(data);
      data = JSON.parse(data);
    }
    return data;
  }
  public async put({
    key,
    value,
    privateData,
  }: {
    key: string;
    value: any;
    privateData: any;
  }) {
    if (value === null || value === undefined) {
      logger.debug('keySha set is no data');
      return;
    }
    logger.debug('keySha set key:' + key);
    logger.debug('keySha set data:' + value);
    const aesSupplyInfo = this.generateAesSupple(JSON.stringify(key));
    const encryptShareKey = this.aesEncode(
      aesSupplyInfo.aes_key,
      aesSupplyInfo.aes_iv,
      JSON.stringify(value),
    );
    const dataKey = aesSupplyInfo.key;
    logger.debug('keySha get dataKey:' + dataKey);
    return await this.putToDuath({
      key: dataKey,
      value: encryptShareKey,
      privateData,
      duration: 60 * 60 * 24 * 365,
    });
  }

  private generateAesSupple(key: string): any {
    const concatStr = `${this.app}_${this.publicKey}_${key}`;
    const key1 = CryptoJS.SHA3(concatStr).toString(); // kv 的key
    const key2 = CryptoJS.SHA512(concatStr).toString(); // kv 的 value 加密key
    const aesIv = CryptoJS.enc.Utf8.parse(key2);
    const aesKey = CryptoJS.enc.Utf8.parse(key2);
    return {
      key: key1,
      aes_iv: aesIv,
      aes_key: aesKey,
    };
  }
  aesEncode(aesKey: any, aesIv: any, data: string) {
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let encryptedBase64Data = CryptoJS.enc.Base64.stringify(
      encrypted.ciphertext,
    );
    return encryptedBase64Data;
  }

  aesDecode(aesKey: any, aesIv: any, cryptData: string) {
    cryptData = decodeURIComponent(cryptData);
    let encryptedHexStr = CryptoJS.enc.Base64.parse(cryptData);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
  async putToDuath({ privateData, key, value, duration }: any) {
    return await this.invoke({
      name: 'put',
      data: {
        privateData,
        key: `/service/dauth/${key}`,
        value,
        duration,
      },
    });
  }
  async getFromDauth({ key }: any) {
    const res = await this.invoke({
      name: 'get',
      data: {
        key: `/service/dauth/${key}`,
      },
    });
    let result;
    const { code, data } = res.data;
    if (code === '000000' && data !== null && data !== undefined) {
      try {
        result = data;
      } catch (error) {
        console.log('获取dauth 数据失败');
        console.log(error);
      }
    }
    return result;
  }
  async invoke({
    name,
    data,
    method = 'post',
  }: {
    name: string;
    data: Record<string, any>;
    method?: string;
  }) {
    data.appName = this.app;
    const url = `http://192.168.2.65:8888/sdk/${name}`;
    return await this.request({ url, method, data });
  }
  async request({ url, method, data, params }: any) {
    return await axios({ url, method, data, params });
  }
}
