import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';

export const signMessage = (
  message: string,
  {
    publicKey,
    privateKey,
  }: {
    publicKey: string;
    privateKey: string;
  },
) => {
  const signHash = ethers.solidityPackedKeccak256(
    ['address', 'string'],
    [publicKey, message.toString()],
  );
  const signMessage = EthCrypto.sign(privateKey, signHash);
  return signMessage;
};
