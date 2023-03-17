import { ethers } from 'ethers';

const main = async () => {
  // 生成一个钱包
  const wallet = ethers.Wallet.createRandom();
  console.log(wallet);
  // console.log(wallet.privateKey);
  // // 要签名的数据
  const message = 'Hello';
  const privateKey = wallet.privateKey;
  console.log(privateKey);
  const messageBytes = ethers.toUtf8Bytes(message);
  // const signingKey = new ethers.SigningKey(privateKey);
  // console.log(signingKey);
  // const signature = signingKey.signDigest(ethers.keccak256(messageBytes));
  console.log(signature);
  // // // 对数据进行签名
  const signature = await wallet.signMessage(messageBytes);
  // // console.log(signature);
  // // 验证签名
  // const signer = await ethers.verifyMessage(data, '0x075c43d84f11a48c80baccb20076fb9c62458ff7ba9a9e2e004b142328d531b13105edefdd5a8f1767fa1389260ae3213bc209f91b1072924a72eb309345');
  // console.log('Signer address:', signer);
};
main();
