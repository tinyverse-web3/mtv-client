import CryptoJS from 'crypto-js';
/**
 * MtvCrypto类，用于加密和解密数据
 */
export class MtvCrypto {
  private readonly iv: any;
  private readonly key: any;
  /**
   * 构造函数
   * @param privateKey 私钥
   */
  constructor(privateKey: string) {
    // 将私钥的后16位作为iv向量
    this.iv = CryptoJS.enc.Utf8.parse(privateKey.slice(-16));
    // 将私钥转换为UTF-8编码的字节数组作为密钥
    this.key = CryptoJS.enc.Utf8.parse(privateKey);
  }
  /**
   * 加密数据
   * @param data 待加密数据
   * @returns 加密后的数据
   */
  async encrypt(data: string) {
    // 将待加密数据转换为UTF-8编码的字节数组
    let srcs = CryptoJS.enc.Utf8.parse(data);
    // 使用AES算法进行加密
    let encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    // 将加密后的数据转换为Base64编码的字符串
    let encryptedBase64Data = CryptoJS.enc.Base64.stringify(
      encrypted.ciphertext,
    );
    return encryptedBase64Data;
  }
  /**
   * 解密数据
   * @param data 待解密数据
   * @returns 解密后的数据
   */
  async decrypt(data: string) {
    // 将待解密数据转换为Base64编码的字节数组
    let encryptedHexStr = CryptoJS.enc.Base64.parse(data);
    // 将待解密数据转换为Base64编码的字符串
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    // 使用AES算法进行解密
    let decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    // 将解密后的数据转换为UTF-8编码的字符串
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
}
