import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';

export const signMessage = (
  message: string,
  {
    address,
    privateKey,
  }: {
    address: string;
    privateKey: string;
  },
) => {
  const signHash = ethers.solidityPackedKeccak256(
    ['address', 'string'],
    [address, message.toString()],
  );
  const signMessage = EthCrypto.sign(privateKey, signHash);
  return signMessage;
};
