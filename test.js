import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';

export const signMessage = (
  message,
  {
    address,
    privateKey,
  },
) => {
  const signHash = ethers.solidityPackedKeccak256(
    ['address', 'string'],
    [address, message.toString()],
  );
  const signMessage = EthCrypto.sign(privateKey, signHash);
  return signMessage;
};
