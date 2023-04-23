import { useWalletStore, useChainStore, Token } from '@/store';
import { useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useList } from 'react-use';
const getChainToeken = async (address: string, rpc_url: string) => {
  const provider = new ethers.JsonRpcProvider(rpc_url);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};
export const useWalletBalance = () => {
  const wallet = useWalletStore((state) => state.wallet);
  const chain = useChainStore((state) => state.chain);
  const [list, { set }] = useList<Token>([]);
  const getAllBalance = async () => {
    const tokenList: Token[] = [];
    const { address } = wallet || {};
    if (address && chain) {
      const { rpc_url } = chain;
      const tokenBalance = await getChainToeken(address, rpc_url);
      tokenList.push({
        symbol: chain.symbol,
        icon: chain.icon,
        balance: tokenBalance,
      });
    }
    set(tokenList);
  };
  useEffect(() => {
    getAllBalance();
  }, [wallet, chain]);
  return [list];
};
