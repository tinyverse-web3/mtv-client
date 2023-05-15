import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Logger } from 'tslog';
import { config } from './mpc/config';

const logger = new Logger({ name: 'KeySha' });

export class KeySha {
  private publicKey: string;
  private readonly qasks_api_key = import.meta.env
    .VITE_KEY_QASKS_API_SECRET_KEY;
  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
  public async get(key: string) {
    logger.debug('keySha get key:' + key);
    const aesSupplyInfo = this.generateAesSupple(key);
    const dataKey = aesSupplyInfo.key;
    const encryptShareKey = await this.getKeyFromKvServer(dataKey);
    let data;
    logger.debug('keySha get data:' + data);
    if (data) {
      data = this.aesDecode(
        aesSupplyInfo.aes_key,
        aesSupplyInfo.aes_iv,
        encryptShareKey,
      );
      data = JSON.parse(data);
    }
    return data;
  }

  public async set(key: string, data: any) {
    if (data === null || data === undefined) {
      logger.debug('keySha set is no data');
      return;
    }
    logger.debug('keySha set key:' + key);
    logger.debug('keySha set data:' + data);
    const aesSupplyInfo = this.generateAesSupple(JSON.stringify(key));
    const encryptShareKey = this.aesEncode(
      aesSupplyInfo.aes_key,
      aesSupplyInfo.aes_iv,
      data,
    );
    const dataKey = aesSupplyInfo.key;
    return await this.setKeyToKvServer(dataKey, encryptShareKey);
  }

  private generateAesSupple(key: string): any {
    const concatStr = `${this.qasks_api_key}_${this.publicKey}_${key}`;
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

  private async getKeyFromKvServer(key: string) {
    const httpConfig = {
      headers: {
        qasks_api_key: config.kv.qasks_api_key,
        qasks_api_secret_key: config.kv.qasks_api_secret_key,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const getKeyUrl = config.kv.key_server_url + config.kv.get_key_url + key;
    logger.info('getKey key: ' + key);
    return axios
      .get(getKeyUrl, httpConfig)
      .then((res) => {
        if (res.data.code == '000000') {
          logger.info('getKey value: ' + res.data.data);
          return res.data.data;
        }
        throw new Error(res.data.msg);
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  private async setKeyToKvServer(key: string, value: string) {
    const httpConfig = {
      headers: {
        qasks_api_key: config.kv.qasks_api_key,
        qasks_api_secret_key: config.kv.qasks_api_secret_key,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const setKeyUrl = config.kv.key_server_url + config.kv.set_key_url;
    const setData = {
      key: key,
      value: value,
    };
    logger.info('keySha push hash key: ' + key);
    logger.info('keySha push hash value: ' + key);
    return axios
      .post(setKeyUrl, setData, httpConfig)
      .then((res) => {
        if (res.data.code == '000000') {
          return res.data.data;
        }
        logger.error(res.data.msg);
        throw new Error(res.data.msg);
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
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
}
