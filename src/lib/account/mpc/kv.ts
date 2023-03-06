import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Logger } from 'tslog';
import { config } from './config';

const logger = new Logger({ name: 'KeySha' });

export class KeySha {
  
  public async get(userId:string, question:string, answer:string){
    const aesSupplyInfo = this.generateAesSupple(userId, question, answer);
    const dataKey = aesSupplyInfo.key;
    const encryptShareKey = await this.getKeyFromKvServer(dataKey);
    const shareKey = this.aesDecode(aesSupplyInfo.aes_key, aesSupplyInfo.aes_iv, encryptShareKey)
    return shareKey;
  }

  public async set(userId:string, question:string, answer:string, shareKey: string){
    const aesSupplyInfo = this.generateAesSupple(userId, question, answer);
    const encryptShareKey = this.aesEncode(aesSupplyInfo.aes_key, aesSupplyInfo.aes_iv, shareKey);
    const dataKey = aesSupplyInfo.key;
    return await this.setKeyToKvServer(dataKey, encryptShareKey);
  }

  private generateAesSupple(userId:string, question:string, answer:string) :any {
    const concatStr = config.kv.qasks_api_key + userId + question + answer;
    const key = CryptoJS.SHA3(concatStr).toString();
    const aesIv = CryptoJS.enc.Utf8.parse(answer);
    const aesKey = CryptoJS.enc.Utf8.parse(answer);
    return {
      'key': key,
      'aes_iv': aesIv,
      'aes_key': aesKey
    }
  }
  
  private async getKeyFromKvServer(key: string) {
    const httpConfig = {
      headers: {
        qasks_api_key: config.kv.qasks_api_key,
        qasks_api_secret_key: config.kv.qasks_api_secret_key,
      },
    };
    const getKeyUrl =
      config.kv.key_server_url + config.kv.get_key_url + key;
      logger.info("getKey key: " + key);
    return axios
      .get(getKeyUrl, httpConfig)
      .then((res) => {
        if(res.data.code  == '000000' ){
          logger.info("getKey value: " + res.data.data);
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
        'qasks_api_key': config.kv.qasks_api_key,
        'qasks_api_secret_key': config.kv.qasks_api_secret_key
      },
    };
    const setKeyUrl = config.kv.key_server_url + config.kv.set_key_url
    const setData = {
      "key": key,
      "value": value
    }
    logger.info("setkey key: " + key);
    logger.info("setkey value: " + key);
    return axios
      .post(setKeyUrl, setData, httpConfig)
      .then((res) => {
        if(res.data.code  == '000000' ){
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

  aesEncode(aesKey:any, aesIv:any, data: string) {
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let encryptedBase64Data = CryptoJS.enc.Base64.stringify(
      encrypted.ciphertext,
    );
    return encodeURIComponent(encryptedBase64Data);
  }

  aesDecode(aesKey:any, aesIv:any, cryptData: string) {
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
