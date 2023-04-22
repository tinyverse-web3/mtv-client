import CryptoJS from 'crypto-js';
const main = async () => {
  const password = '38f56e154d0f07abfd95b62f17c7272db68110b014a26ff8194ef22b113b466a';
  const key = CryptoJS.enc.Base64.parse(password);
  // 生成一个钱包
  function encrypt(data) {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    console.log('iv', iv);
    console.log('iv', iv.toString());
    const srcs = CryptoJS.enc.Utf8.parse(data);
    console.log('srcs', srcs.toString())
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log('iv', encrypted.iv);
    return {
      iv: encrypted.iv.toString(CryptoJS.enc.Hex),
      content: encrypted.toString(),
    };
  }
  function decrypt(encrypted) {
    const { iv, content } = encrypted;
    console.log(content);
    console.log('iv', CryptoJS.enc.Hex.parse(iv));
    console.log('iv', CryptoJS.enc.Hex.parse(iv).toString());
    const decrypt = CryptoJS.AES.decrypt(content, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log('decrypt', decrypt.toString());
    return decrypt.toString(CryptoJS.enc.Utf8);
  }
  const message = '0x8e401cdf8613a605f12ba8937bdb0687';
  const encrypted = encrypt(message);
  console.log('encrypted', encrypted);
  const decrypted = decrypt(encrypted);
  console.log('decrypted', decrypted);
};
main();
