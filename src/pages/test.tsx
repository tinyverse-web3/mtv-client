import { Button } from '@nextui-org/react';
 import { MtvDb } from '@/lib/mtv-db';
 import { keys, PrivateKey, PublicKey, aes } from 'libp2p-crypto';
 import  CryptoJS from 'crypto-js'
// import { ethers } from 'ethers';
// import EthCrypto from 'eth-crypto';
export default function Test() {
  const start = async () => {
    debugger;
    const privateKey = '5f39cceb470cbc0b9259a0099a5238f3cc069858f8275802c17b37bf545d6df2';
    const dbAddress = '/orbitdb/zdpuAmbXnVrBYvjhUCXG6hTzKHUiNug8KvvXzPnaoZYBV6bQT/mtv_kv';
    const metadataKey = 'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';
    const mtvdb = MtvDb.getInstance();
    //await mtvdb.createInstance(privateKey, dbAddress, metadataKey);
    //第一次使用,可以拿到一个dbAddress与metadataKey通过下面接口获取
    //mtvdb.dbAddress
    //mtvdb.metadataKey
    //await mtvdb.createInstance(privateKey);

    //后续正常使用（）
    await mtvdb.createInstance(privateKey, dbAddress, metadataKey);
    await mtvdb.createInstance(privateKey, dbAddress, metadataKey);
    await mtvdb.createInstance(privateKey, dbAddress, metadataKey);

    //完全恢复（）
    //await mtvdb.createInstance(privateKey, '', metadataKey);

    //数据的增改
    const value001 = {
      personalInfo: { myname: 'jack', wehight: '120' }
    };

    const value002 = {
      'is': 'bob'
    }
    await mtvdb.put('k001', JSON.stringify(value001));
    await mtvdb.put('k002', JSON.stringify(value002));
    const get1 = await mtvdb.get('k001');
    const get2 = await mtvdb.get('k002');
    await mtvdb.backupDb();
    //await mtvdb.closeDb();
    // const aesIv =  CryptoJS.enc.Utf8.parse(privateKey.slice(-16));
    // const aesKey = CryptoJS.enc.Utf8.parse(privateKey);
    // let srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(value001));
    // let encrypted = CryptoJS.AES.encrypt(srcs, aesKey, { iv: aesIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    // let encryptedBase64Data = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    // let cryptData = encodeURIComponent(encryptedBase64Data);
    // cryptData = decodeURIComponent(cryptData)
    // let encryptedHexStr = CryptoJS.enc.Base64.parse(cryptData);
    // let srcsBase64 = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    // let decrypt = CryptoJS.AES.decrypt(srcsBase64, aesKey, { iv: aesIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    // let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    // console.log(decryptedStr.toString());
  };

  return <Button onPress={start}>测试</Button>;
}
