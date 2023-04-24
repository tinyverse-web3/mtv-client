import CryptoJS from 'crypto-js';

export class MtvCrypto {
  private readonly iv: any;
  private readonly key: any;
  constructor(privateKey: string) {
    this.iv = CryptoJS.enc.Utf8.parse(privateKey.slice(-16));
    this.key = CryptoJS.enc.Utf8.parse(privateKey);
  }
  async encrypt(data: string) {
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let encryptedBase64Data = CryptoJS.enc.Base64.stringify(
      encrypted.ciphertext,
    );
    return encryptedBase64Data;
  }
  async decrypt(data: string) {
    let encryptedHexStr = CryptoJS.enc.Base64.parse(data);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
}
